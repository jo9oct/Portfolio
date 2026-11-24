import { DurableObject } from "cloudflare:workers";

export interface Env {
  VISITOR_COUNTER: DurableObjectNamespace<VisitorCounterDO>;
  CLOUDFLARE_VISITOR_API_SECRET?: string;
}

interface RegisterRequestBody {
  visitorId?: string;
}

/**
 * SQLite-backed Durable Object for atomic and idempotent visitor counting.
 * Durable Objects execute within a single-threaded actor model, eliminating race conditions.
 */
export class VisitorCounterDO extends DurableObject {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);

    // Initialize SQLite schema
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS visitors (
        visitor_id TEXT PRIMARY KEY,
        created_at INTEGER NOT NULL
      );
    `);
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // CORS & preflight (if called directly, though typically called via backend)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // POST /register - Register unique visitor idempotently
    if (url.pathname === "/register" && request.method === "POST") {
      try {
        const body = (await request.json()) as RegisterRequestBody;
        const visitorId = body?.visitorId;

        if (
          !visitorId ||
          typeof visitorId !== "string" ||
          visitorId.length < 16 ||
          visitorId.length > 128 ||
          !/^[a-zA-Z0-9_-]+$/.test(visitorId)
        ) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Invalid visitorId format",
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        // Check whether visitor already exists
        const existing = this.ctx.storage.sql
          .exec("SELECT 1 FROM visitors WHERE visitor_id = ? LIMIT 1", visitorId)
          .toArray();

        let isNew = false;
        if (existing.length === 0) {
          // Atomic INSERT OR IGNORE
          this.ctx.storage.sql.exec(
            "INSERT OR IGNORE INTO visitors (visitor_id, created_at) VALUES (?, ?)",
            visitorId,
            Date.now()
          );
          isNew = true;
        }

        // Query canonical count directly from SQLite
        const countQuery = this.ctx.storage.sql
          .exec("SELECT COUNT(*) as total FROM visitors")
          .toArray();

        const totalVisitors = Number(countQuery[0]?.total || 0);

        return new Response(
          JSON.stringify({
            success: true,
            isNew,
            totalVisitors,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Internal error";
        return new Response(
          JSON.stringify({ success: false, error: message }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // GET /stats - Fetch total unique visitors
    if (url.pathname === "/stats" && request.method === "GET") {
      try {
        const countQuery = this.ctx.storage.sql
          .exec("SELECT COUNT(*) as total FROM visitors")
          .toArray();

        const totalVisitors = Number(countQuery[0]?.total || 0);

        return new Response(
          JSON.stringify({
            success: true,
            totalVisitors,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Internal error";
        return new Response(
          JSON.stringify({ success: false, error: message }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: false, error: "Endpoint not found" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * Worker Gateway Handler:
 * Authenticates requests and forwards to the singleton SQLite Durable Object instance.
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Validate Authorization Header if secret is set
    const expectedSecret = env.CLOUDFLARE_VISITOR_API_SECRET;
    if (expectedSecret) {
      const authHeader = request.headers.get("Authorization");
      const bearerToken = authHeader?.replace(/^Bearer\s+/i, "");

      if (!bearerToken || bearerToken !== expectedSecret) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Unauthorized: Invalid or missing API secret",
          }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Access singleton Durable Object
    const doId = env.VISITOR_COUNTER.idFromName("portfolio-global-counter");
    const stub = env.VISITOR_COUNTER.get(doId);

    return stub.fetch(request);
  },
};

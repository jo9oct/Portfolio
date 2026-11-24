import http from "node:http";
import express from "express";
import cors from "cors";
import visitorRouter from "../src/router/visitor.route.js";

async function runTestSuite() {
  process.env.NODE_ENV = "test";
  console.log("=================================================");
  console.log("   PORTFOLIO VISITOR COUNTER - VERIFICATION TEST  ");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Setup Mock Cloudflare Worker (simulating SQLite-backed Durable Object)
  const mockDb = new Set();
  const mockSecret = "test-secret-12345";
  let requestCounter = 0;

  const mockWorkerServer = http.createServer((req, res) => {
    const auth = req.headers["authorization"];
    if (auth !== `Bearer ${mockSecret}`) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Unauthorized" }));
      return;
    }

    if (req.method === "POST" && req.url === "/register") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        try {
          const { visitorId } = JSON.parse(body);
          if (!visitorId || typeof visitorId !== "string" || visitorId.length < 16) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: "Invalid visitorId" }));
            return;
          }

          requestCounter++;
          let isNew = false;
          if (!mockDb.has(visitorId)) {
            mockDb.add(visitorId);
            isNew = true;
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: true,
              isNew,
              totalVisitors: mockDb.size,
            })
          );
        } catch {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, error: "Malformed JSON" }));
        }
      });
      return;
    }

    if (req.method === "GET" && req.url === "/stats") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          totalVisitors: mockDb.size,
        })
      );
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  });

  const workerPort = 45892;
  await new Promise((resolve) => mockWorkerServer.listen(workerPort, resolve));

  // Configure environment for the backend
  process.env.CLOUDFLARE_VISITOR_API_URL = `http://localhost:${workerPort}`;
  process.env.CLOUDFLARE_VISITOR_API_SECRET = mockSecret;

  // 2. Setup Test Express App with visitor routes
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api/v1/visitors", visitorRouter);

  const expressPort = 45893;
  const expressServer = await new Promise((resolve) => {
    const s = app.listen(expressPort, () => resolve(s));
  });

  const backendBase = `http://localhost:${expressPort}/api/v1/visitors`;

  try {
    // SCENARIO 10: Validation rejects invalid visitorId
    const resInvalid1 = await fetch(`${backendBase}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert(resInvalid1.status === 400, "Scenario 10a: Rejects request with missing visitorId (400)");

    const resInvalid2 = await fetch(`${backendBase}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: "short" }),
    });
    assert(resInvalid2.status === 400, "Scenario 10b: Rejects visitorId shorter than 16 chars (400)");

    const resInvalid3 = await fetch(`${backendBase}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: "invalid@char$#*&^%" }),
    });
    assert(resInvalid3.status === 400, "Scenario 10c: Rejects visitorId with illegal characters (400)");

    // SCENARIO 1: First-time browser visit increments count by one
    const visitor1 = "usr_94a7e3b1-419a-4c26-8041-0309e3943310";
    const resReg1 = await fetch(`${backendBase}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: visitor1 }),
    });
    const dataReg1 = await resReg1.json();
    assert(
      dataReg1.success === true && dataReg1.data.totalVisitors === 1 && dataReg1.data.isNew === true,
      "Scenario 1: First-time browser visit increments count by 1 (total: 1, isNew: true)"
    );

    // SCENARIO 2, 3, 4, 6, 7: Duplicate requests with same ID NEVER increment count
    const resReg1Repeat = await fetch(`${backendBase}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: visitor1 }),
    });
    const dataReg1Repeat = await resReg1Repeat.json();
    assert(
      dataReg1Repeat.success === true &&
        dataReg1Repeat.data.totalVisitors === 1 &&
        dataReg1Repeat.data.isNew === false,
      "Scenario 2-7: Repeated request (refresh/re-render/StrictMode/nav) does NOT increment count (total: 1, isNew: false)"
    );

    // SCENARIO 8: A different browser / visitor ID counts as a new visitor
    const visitor2 = "usr_88f2b1c4-1234-4a21-9999-112233445566";
    const resReg2 = await fetch(`${backendBase}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: visitor2 }),
    });
    const dataReg2 = await resReg2.json();
    assert(
      dataReg2.success === true && dataReg2.data.totalVisitors === 2 && dataReg2.data.isNew === true,
      "Scenario 8: Different browser visitor ID increments count to 2"
    );

    // SCENARIO 9: Concurrent requests with same ID increment only once
    const visitor3 = "usr_concurrent_f7238a9e0128374";
    const concurrentPromises = Array.from({ length: 10 }, () =>
      fetch(`${backendBase}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: visitor3 }),
      }).then((r) => r.json())
    );
    const concurrentResults = await Promise.all(concurrentPromises);
    const newCount = concurrentResults.filter((r) => r.data?.isNew === true).length;
    const statsAfterConcurrent = await (await fetch(`${backendBase}/stats`)).json();

    assert(
      newCount === 1 && statsAfterConcurrent.data.totalVisitors === 3,
      `Scenario 9: 10 simultaneous concurrent requests incremented exactly once (newCount: ${newCount}, total: 3)`
    );

    // SCENARIO 12: GET /stats returns actual visitor count
    const resStats = await fetch(`${backendBase}/stats`);
    const dataStats = await resStats.json();
    assert(
      dataStats.success === true && dataStats.data.totalVisitors === 3,
      "Scenario 12: GET /api/v1/visitors/stats returns accurate total count (3)"
    );

    // SCENARIO 11: Resilient error handling when external service fails
    process.env.CLOUDFLARE_VISITOR_API_URL = "http://localhost:59999/unreachable";
    const resFail = await fetch(`${backendBase}/stats`);
    const dataFail = await resFail.json();
    assert(
      resFail.status >= 500 && dataFail.success === false,
      "Scenario 11: External service failure returns clean error response without crashing process"
    );
  } finally {
    mockWorkerServer.close();
    expressServer.close();
  }

  console.log("\n-------------------------------------------------");
  console.log(`Results: ${passed} passed, ${failed} failed.`);
  console.log("-------------------------------------------------\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});

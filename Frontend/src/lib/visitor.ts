import axios from "axios";

const VISITOR_ID_KEY = "portfolio_visitor_id";
const VISITOR_REGISTERED_KEY = "portfolio_visitor_registered";

/**
 * Returns the backend base URL from environment variables,
 * defaulting to the current origin or localhost:3422.
 */
export function getBackendUrl(): string {
  const url = import.meta.env.VITE_BACKEND_URL;
  return url.replace(/\/+$/, "");
}

/**
 * Retrieves the persistent visitor ID from localStorage,
 * or generates and persists a cryptographically secure UUID on first visit.
 */
export function getOrCreateVisitorId(): string {
  try {
    const existingId = localStorage.getItem(VISITOR_ID_KEY);
    if (existingId && existingId.length >= 16) {
      return existingId;
    }

    // Generate cryptographic UUID v4
    let newId: string;
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      newId = crypto.randomUUID();
    } else {
      // Fallback using crypto.getRandomValues
      newId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (crypto.getRandomValues(new Uint8Array(1))[0] % 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    localStorage.setItem(VISITOR_ID_KEY, newId);
    return newId;
  } catch {
    // Fallback if localStorage is disabled or restricted
    return "anon-" + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

/**
 * Checks whether this browser visitor has already completed registration.
 */
export function isVisitorRegistered(): boolean {
  try {
    return localStorage.getItem(VISITOR_REGISTERED_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Marks this visitor as successfully registered in localStorage.
 */
export function markVisitorRegistered(): void {
  try {
    localStorage.setItem(VISITOR_REGISTERED_KEY, "true");
  } catch {
    // Ignore storage quota/permission errors
  }
}

export interface VisitorStatsResponse {
  totalVisitors: number;
  isNew?: boolean;
}

/**
 * Registers the visitor ID with the backend.
 * Idempotent at all layers.
 */
export async function registerVisitor(visitorId: string): Promise<VisitorStatsResponse> {
  const backendUrl = getBackendUrl();
  const response = await axios.post<{
    success: boolean;
    data: { totalVisitors: number; isNew: boolean };
  }>(
    `${backendUrl}/api/v1/visitors/register`,
    { visitorId },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 8000,
    }
  );

  if (!response.data || !response.data.success) {
    throw new Error("Failed to register visitor.");
  }

  return response.data.data;
}

/**
 * Fetches the current total unique visitor count without registering.
 */
export async function fetchVisitorStats(): Promise<VisitorStatsResponse> {
  const backendUrl = getBackendUrl();
  const response = await axios.get<{
    success: boolean;
    data: { totalVisitors: number };
  }>(`${backendUrl}/api/v1/visitors/stats`, {
    timeout: 8000,
  });

  if (!response.data || !response.data.success) {
    throw new Error("Failed to fetch visitor stats.");
  }

  return response.data.data;
}

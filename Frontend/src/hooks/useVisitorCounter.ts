import { useState, useEffect } from "react";
import {
  getOrCreateVisitorId,
  isVisitorRegistered,
  markVisitorRegistered,
  registerVisitor,
  fetchVisitorStats,
} from "@/lib/visitor";

interface UseVisitorCounterResult {
  totalVisitors: number | null;
  isLoading: boolean;
  error: string | null;
}

// Module-level shared singleton cache and dispatch state
let cachedTotal: number | null = null;
let cachedLoading: boolean = true;
let cachedError: string | null = null;
let inFlightPromise: Promise<number> | null = null;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // ignore listener error
    }
  });
}

/**
 * Executes visitor registration or stats retrieval exactly once,
 * deduplicating simultaneous calls and caching the result.
 */
async function syncVisitorOnce(): Promise<number> {
  if (cachedTotal !== null) {
    return cachedTotal;
  }
  if (inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    try {
      cachedLoading = true;
      cachedError = null;
      notifyListeners();

      const visitorId = getOrCreateVisitorId();
      const alreadyRegistered = isVisitorRegistered();

      let total: number;
      if (alreadyRegistered) {
        // Visitor already counted in this browser: fetch latest stats only
        const stats = await fetchVisitorStats();
        total = stats.totalVisitors;
      } else {
        // First visit for this browser: register atomically
        const result = await registerVisitor(visitorId);
        markVisitorRegistered();
        total = result.totalVisitors;
      }

      cachedTotal = total;
      cachedLoading = false;
      cachedError = null;
      notifyListeners();
      return total;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load visitor counter";
      console.warn("Visitor counter sync error:", msg);

      // Attempt fallback to stats endpoint
      try {
        const fallback = await fetchVisitorStats();
        cachedTotal = fallback.totalVisitors;
        cachedLoading = false;
        cachedError = null;
        notifyListeners();
        return fallback.totalVisitors;
      } catch {
        cachedLoading = false;
        cachedError = msg;
        notifyListeners();
        throw err;
      }
    } finally {
      inFlightPromise = null;
    }
  })();

  return inFlightPromise;
}

export function useVisitorCounter(): UseVisitorCounterResult {
  const [totalVisitors, setTotalVisitors] = useState<number | null>(cachedTotal);
  const [isLoading, setIsLoading] = useState<boolean>(cachedLoading);
  const [error, setError] = useState<string | null>(cachedError);

  useEffect(() => {
    const handleChange = () => {
      setTotalVisitors(cachedTotal);
      setIsLoading(cachedLoading);
      setError(cachedError);
    };

    listeners.add(handleChange);

    // Initial sync
    if (cachedTotal === null) {
      syncVisitorOnce().catch(() => {});
    }

    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  return { totalVisitors, isLoading, error };
}

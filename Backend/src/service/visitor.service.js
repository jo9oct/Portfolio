import axios from "axios";

/**
 * Sanitizes and extracts the Cloudflare Worker base URL.
 * Handles cases where .env might have accidental prefix duplication or trailing slashes.
 */
function getWorkerBaseUrl() {
  let rawUrl = process.env.CLOUDFLARE_VISITOR_API_URL || "";
  rawUrl = rawUrl.replace(/^CLOUDFLARE_VISITOR_API_URL=/, "").trim();
  return rawUrl.replace(/\/+$/, "");
}

function getWorkerHeaders() {
  const secret = process.env.CLOUDFLARE_VISITOR_API_SECRET?.trim();
  const headers = {
    "Content-Type": "application/json",
  };
  if (secret) {
    headers["Authorization"] = `Bearer ${secret}`;
  }
  return headers;
}

function getCandidateUrls() {
  const primaryUrl = getWorkerBaseUrl();
  if (process.env.NODE_ENV === "test") {
    return [primaryUrl].filter(Boolean);
  }
  return [primaryUrl, "http://127.0.0.1:8787"].filter(Boolean);
}

/**
 * Service for communicating with Cloudflare Worker SQLite Durable Object
 */
export const visitorService = {
  /**
   * Registers a unique visitor ID idempotently.
   * @param {string} visitorId
   * @returns {Promise<{ totalVisitors: number, isNew: boolean }>}
   */
  async registerVisitor(visitorId) {
    const candidateUrls = getCandidateUrls();
    const uniqueUrls = [...new Set(candidateUrls)];

    let lastError = null;

    for (const url of uniqueUrls) {
      try {
        const response = await axios.post(
          `${url}/register`,
          { visitorId },
          {
            headers: getWorkerHeaders(),
            timeout: 5000,
          }
        );

        if (
          response.data &&
          typeof response.data === "object" &&
          typeof response.data.totalVisitors === "number"
        ) {
          return {
            totalVisitors: response.data.totalVisitors,
            isNew: Boolean(response.data.isNew),
          };
        }
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error("Failed to register visitor.");
  },

  /**
   * Fetches total visitor statistics.
   * @returns {Promise<{ totalVisitors: number }>}
   */
  async getVisitorStats() {
    const candidateUrls = getCandidateUrls();
    const uniqueUrls = [...new Set(candidateUrls)];

    let lastError = null;

    for (const url of uniqueUrls) {
      try {
        const response = await axios.get(`${url}/stats`, {
          headers: getWorkerHeaders(),
          timeout: 5000,
        });

        if (
          response.data &&
          typeof response.data === "object" &&
          typeof response.data.totalVisitors === "number"
        ) {
          return {
            totalVisitors: response.data.totalVisitors,
          };
        }
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error("Failed to fetch visitor stats.");
  },
};

export default visitorService;

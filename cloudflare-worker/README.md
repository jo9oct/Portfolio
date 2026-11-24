# Portfolio Visitor Counter (Cloudflare Worker + SQLite Durable Object)

This worker provides production-ready unique visitor counting powered by Cloudflare Durable Objects backed by embedded SQLite storage.

## Features
- **Embedded SQLite Storage**: Every unique visitor ID is permanently tracked in a SQLite table with primary key uniqueness.
- **Strict Concurrency Protection**: Single-threaded actor model prevents race conditions during simultaneous visits.
- **Idempotency**: Repeated registration calls with the same visitor ID never duplicate the count.
- **Secret Token Authentication**: Enforces `Authorization: Bearer <SECRET>` for backend-to-worker communication.

## Endpoints

### 1. `POST /register`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <CLOUDFLARE_VISITOR_API_SECRET>`
- **Body:**
  ```json
  { "visitorId": "f47ac10b-58cc-4372-a567-0e02b2c3d479" }
  ```
- **Response:**
  ```json
  { "success": true, "isNew": true, "totalVisitors": 1284 }
  ```

### 2. `GET /stats`
- **Headers:**
  - `Authorization: Bearer <CLOUDFLARE_VISITOR_API_SECRET>`
- **Response:**
  ```json
  { "success": true, "totalVisitors": 1284 }
  ```

## Deployment Instructions

1. Install dependencies:
   ```bash
   cd cloudflare-worker
   npm install
   ```

2. Authenticate Wrangler with your Cloudflare account (if not already logged in):
   ```bash
   npx wrangler login
   ```

3. Set your secret token in Cloudflare:
   ```bash
   npx wrangler secret put CLOUDFLARE_VISITOR_API_SECRET
   ```

4. Deploy the worker:
   ```bash
   npx wrangler deploy
   ```

5. Copy the deployed worker URL (e.g., `https://portfolio-visitor-counter.<subdomain>.workers.dev`) and set `CLOUDFLARE_VISITOR_API_URL` in your Express backend `.env`.

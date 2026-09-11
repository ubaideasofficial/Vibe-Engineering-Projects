# MCP Forge Production Implementation Plan

Input: public website URL -> output: a persisted, tenant-owned MCP capability server.

The platform uses one shared MCP runtime. Each website is represented by a validated capability spec and served at `/mcp/:siteId`; separate processes per site are not created.

## Target Free-First Architecture

```text
Vercel dashboard
        |
        v
Persistent API + MCP runtime on Oracle Always Free VM/VPS
        |                         |
        v                         v
Supabase Postgres/Auth       Playwright worker in Docker
        |
        v
Upstash Redis + BullMQ job queue
```

- Vercel: Next.js dashboard only.
- Supabase: Postgres, Auth, row-level security, capability specs, jobs, and storage.
- Upstash Redis: durable generation queue and retries.
- Persistent VM/VPS: Express API, Streamable HTTP MCP runtime, and discovery worker.
- Cloudflare DNS + Caddy/Nginx: public HTTPS for `https://mcpforge.app/mcp/:siteId`.
- OpenRouter: discovery reasoning only via `OPEN_ROUTER_API_KEY`.

Vercel serverless functions are not the MCP runtime because Playwright jobs and long-lived Streamable HTTP connections need a persistent process.

## Current Baseline

Already implemented locally:

- Next.js dashboard and SSE progress UI.
- Robots-aware public URL crawler.
- Playwright JSON XHR/fetch recorder.
- Deterministic endpoint classifier.
- OpenRouter capability synthesis with strict Zod validation and deterministic fallback.
- Read-only MCP execution with API and browser strategies.
- Robots checks, one request/second origin limiter, short GET cache, and private-host URL block.
- Local persisted specs at `data/sites.json`.

The local JSON persistence and in-memory jobs are development-only and are replaced in Phase 1 and Phase 2 below.

## Phase 1 — Persistent Foundation

Goal: make generated sites and jobs durable and tenant-ready.

1. Add Supabase SQL schema for users, sites, capability specs, jobs, MCP tokens, and tool runs.
2. Add a storage repository interface with Supabase implementation and local JSON adapter.
3. Add environment validation and `.env.example`; never commit credentials.
4. Add owner/user fields to API contracts and site records.
5. Replace direct `data/sites.json` access in the API with the repository interface.
6. Add Supabase Row Level Security policies and MCP token hashing design.

Exit checks: a generated spec survives API restart, local adapter tests pass, and a Supabase configuration can be enabled without changing API route code.

## Phase 2 — Durable Jobs

1. Add Upstash Redis/BullMQ queue package.
2. Split API job creation from discovery worker execution.
3. Persist every phase/log/error and support retry with exponential backoff.
4. Source SSE status from persistent job state.
5. Add per-user generation quotas and cancellation.

## Phase 3 — Discovery Quality

1. Expand sitemap parsing and depth-two BFS link mapping.
2. Improve search/list/detail detection and pagination.
3. Capture request method, body, headers minus secrets, response schema, and evidence.
4. Open one detail page after search/list discovery.
5. Block private IPs after DNS resolution and validate redirects.

## Phase 4 — Capability Generation

1. Send bounded evidence to OpenRouter using the configured Nemotron model.
2. Validate exactly two safe read-only capabilities with Zod.
3. Reject destructive actions, credential access, CAPTCHA bypass, and private data tools.
4. Store prompt version, evidence references, and synthesis decision.

## Phase 5 — Runtime and Execution

1. Load specs by tenant-owned `siteId` and validate an MCP access token.
2. Support Streamable HTTP GET/POST/session lifecycle.
3. Add timeout, retry/backoff, cache, per-origin limiter, and bounded response size.
4. Run browser capabilities in an isolated worker/container.
5. Add tool health checks before marking a generated site ready.

## Phase 6 — Client Packaging

1. Add `StdioServerTransport` package generation for local installs.
2. Generate Claude Desktop, Cursor, Codex, Windsurf, and Cline snippets.
3. Add downloadable server bundle and generated README with ToS/robots disclosure.

## Phase 7 — Deployment and Operations

1. Deploy dashboard to Vercel.
2. Deploy API, MCP runtime, and worker to a persistent free-tier VM/VPS.
3. Add Supabase production project, Upstash Redis, HTTPS, and Cloudflare DNS.
4. Add structured logs, health checks, quotas, backups, and scheduled revalidation.

## Phase 1 Status

- [x] Local capability generation and MCP runtime baseline.
- [x] Supabase schema and repository adapter boundary.
- [x] Local repository adapter wired into the API.
- [x] Owner field carried by persisted site records.
- [ ] Supabase live connection and RLS integration test (requires a Supabase project).
- [ ] User authentication and production MCP access-token endpoint.
- [x] Persistent local job records and ownership checks.
- [x] Local adapter and token hashing tests.

## Phase 2 Status

- [x] BullMQ/Upstash-compatible queue abstraction with retry/backoff defaults.
- [x] Separate worker application entrypoint and Redis configuration contract.
- [x] API local mode now dispatches generation through the queue abstraction.
- [x] Shared generation pipeline extracted for API-local and Redis-worker execution.
- [x] Pipeline persists all phase updates through the job repository.
- [x] Add restart/resume and per-user quota tests.

## Phase 3 Status

- [x] Sitemap discovery from robots declarations and `/sitemap.xml`.
- [x] Bounded depth-two same-origin link discovery.
- [x] Robots filtering applied to sitemap and crawled links.
- [x] Request evidence redaction/schema extraction.
- [x] Detail-page navigation after search/list discovery.
- [x] DNS-level private-network and redirect validation.

## Deployment Status

- [x] Production Docker image for API/worker with Playwright Chromium base.
- [x] Docker Compose stack for API, worker, and Redis.
- [x] Caddy reverse-proxy starter config.
- [ ] VPS/VM provider account, public domain, DNS, and HTTPS certificate.
- [ ] Set production `MCP_PUBLIC_URL` and deploy the containers.

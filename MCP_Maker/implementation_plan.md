Implementation Plan
MCP Forge MVP — Implementation Plan
A tool that takes a website URL and generates a working, hosted remote MCP server for it.

Input: Website URL  →  Output: https://mcpforge.app/mcp/:siteId  (paste into Claude/Cursor)
Architecture Overview
Mermaid diagram
Proposed Changes
Monorepo Root
[NEW] mcp-forge-mvp/
Turborepo-style monorepo (no Turbo needed for MVP — just workspaces in package.json).


mcp-forge-mvp/
├── package.json               # workspace root (pnpm workspaces)
├── tsconfig.base.json
├── apps/
│   ├── web/                   # Next.js 14 — URL input + live progress + result page
│   └── api/                   # Express — orchestrates 6-phase pipeline
├── packages/
│   ├── crawler-mini/          # Phase 1: sitemap + shallow link discovery
│   ├── network-sniffer/       # Phase 2: Playwright XHR/fetch recording
│   ├── endpoint-classifier/   # Phase 3: deterministic + LLM endpoint classification
│   ├── capability-synth/      # Phase 4: LLM → Capability Spec JSON
│   └── mcp-codegen/           # Phase 5: template engine → .ts MCP server
├── mcp-runtime/               # Phase 6: multi-tenant MCP server host
├── generated-servers/         # Output: one .ts file per site
└── db/                        # SQLite (site → spec → server mapping)
apps/web — Next.js Dashboard
[NEW] apps/web/app/page.tsx
URL input form with site-type selector (e-commerce / blog / news / directory)
"Generate MCP Server" button → calls POST /api/generate
Live progress log via Server-Sent Events (SSE) polling GET /api/status/:jobId
Result panel: hosted MCP URL + copy-paste config snippets for Claude Desktop and Cursor
apps/api — Express Orchestrator
[NEW] apps/api/src/index.ts
POST /api/generate → validates URL, creates job, runs 6-phase pipeline, returns {jobId}
GET /api/status/:jobId → SSE stream of pipeline phase logs
Integrates with all 5 packages in sequence
packages/crawler-mini — Phase 1
[NEW] packages/crawler-mini/src/index.ts
Fetches robots.txt → parses Disallow rules, Sitemap: entries
Fetches sitemap.xml (up to 100 URLs)
If no sitemap: shallow BFS crawl from homepage (depth ≤ 2, max 30 links)
Identifies: homepage, likely search/listing page, 3–5 detail pages
Returns: { robotsRules, sitemapUrls, crawledLinks, likelySearchPage, likelDetailPages }
packages/network-sniffer — Phase 2
[NEW] packages/network-sniffer/src/index.ts
Uses Playwright (headless Chromium) with CDP network interception
Opens the likelySearchPage
Performs a generic search (types "test" in the first text input found)
Opens 1 detail page
Records ALL XHR/fetch requests: { url, method, requestBody, responseHeaders, responseBody, statusCode }
Filters: only JSON responses (content-type: application/json)
Returns: HAR-like NetworkRecord[]
packages/endpoint-classifier — Phase 3
[NEW] packages/endpoint-classifier/src/index.ts
Deterministic checks (fast path):

Does any recorded URL contain search, query, q=, /api/, /graphql?
Is the response a JSON array or object with items/results/data key?
Does a detail page fetch contain an id or slug path param?
LLM fallback (if deterministic check is inconclusive):

Send top-5 JSON endpoints to Claude/GPT with a structured prompt
Ask: "Which of these is a search API? Which is a detail API? Reply JSON only."
Output: { strategy: "api-call" | "browser-automation", searchEndpoint?, detailEndpoint?, browserSelectors? }
packages/capability-synth — Phase 4
[NEW] packages/capability-synth/src/index.ts
LLM prompt that takes classifier output → produces exactly 2-tool Capability Spec JSON
Tool 1: search_<site> — search/list
Tool 2: get_<site>_detail — detail view
Validates output against a Zod schema before returning
Returns: CapabilitySpec (typed, validated)
packages/mcp-codegen — Phase 5
[NEW] packages/mcp-codegen/src/index.ts
Deterministic template (NO LLM) that generates a valid .ts MCP server:

Uses @modelcontextprotocol/sdk McpServer + StreamableHTTPServerTransport
If strategy === "api-call": generates fetch() based tool implementations
If strategy === "browser-automation": generates Playwright action scripts
Adds: robots.txt check before each request + in-memory 1 req/sec rate limiter
Output: single self-contained generated-servers/<siteId>.ts
mcp-runtime — Phase 6
[NEW] mcp-runtime/src/index.ts
Express server hosting ALL generated MCP servers at GET|POST /mcp/:siteId:

Dynamically imports generated-servers/<siteId>.js (compiled)
Creates one McpServer instance + one StreamableHTTPServerTransport per siteId
Caches instances in a Map<siteId, McpServer> — lazy-loads on first request
Runs sanity test on each tool before marking the site as "ready"
db/ — SQLite
[NEW] db/schema.sql
3 tables: sites (url, name, siteId, status), capability_specs (siteId, specJson), jobs (jobId, siteId, phase, logs, status)

Tech Stack
Layer	Choice	Rationale
Runtime	Node.js 20 + TypeScript	Spec requirement
Monorepo	pnpm workspaces	Lightweight, no Turbo needed
Browser	Playwright (Chromium)	Network sniffing + fallback automation
MCP SDK	@modelcontextprotocol/sdk	Official SDK
Transport	StreamableHTTPServerTransport	Remote MCP (hosted URL)
LLM	OpenRouter API via OPEN_ROUTER_API_KEY, model nvidia/nemotron-3.5-lightning	Classification + capability synthesis without coupling the MVP to one provider SDK
DB	SQLite via better-sqlite3	Zero-setup, sync API
Frontend	Next.js 14 (App Router)	Spec requirement
API Server	Express	Minimal, familiar
Progress	Server-Sent Events	Simple streaming without WebSocket complexity
Resolved Decisions

- LLM provider: Use the existing OpenRouter API credential through the `OPEN_ROUTER_API_KEY` environment variable. Do not commit the key or place it in source files, plans, or frontend code.
- LLM model: Use `nvidia/nemotron-3.5-lightning` for endpoint classification and capability synthesis.
- Hosting: Implement and verify the MVP locally first. The local MCP URL is `http://localhost:4000/mcp/:siteId`; deployment to `mcpforge.app` is deferred.

NOTE

generated-servers/ execution: Generated TypeScript files need to be compiled before mcp-runtime can dynamically import() them. I'll use esbuild to compile each generated .ts to .js immediately after codegen (takes ~100ms). This keeps mcp-runtime simple (no ts-node at runtime).

Build Order (Exactly Per Spec)
apps/web — Next.js dashboard (URL input + progress + result)
packages/network-sniffer — Playwright XHR recording
packages/endpoint-classifier — deterministic + LLM classification
packages/capability-synth — LLM → Capability Spec JSON
packages/mcp-codegen — template engine → .ts MCP server
mcp-runtime — multi-tenant Express host
apps/api — orchestrator connecting all phases
packages/crawler-mini — sitemap/robots (can run in parallel)
End-to-end test on 3 sites (WordPress blog, e-commerce, news)
Result page with copy-paste config snippets
Verification Plan
Automated
Type-check: pnpm -r tsc --noEmit
Unit tests for endpoint classifier deterministic logic
Manual E2E
Start mcp-runtime + apps/api + apps/web
Paste a WordPress blog URL → confirm JSON API discovered → confirm MCP URL returned
Add MCP URL to Claude Desktop → call search_posts and get_post_detail → confirm real data
Test on a small e-commerce site → confirm product search works
Test on a site with no JSON API → confirm browser-automation fallback works
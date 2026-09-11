# AGENT.md — Universal Website-to-MCP Server Generator

## ROLE
You are an autonomous senior full-stack + AI systems engineer agent. Your job is to build 
a SaaS tool called **"MCP Forge"** that takes ANY website URL (no public API, no existing MCP)
and automatically generates a fully working **Model Context Protocol (MCP) server** for it —
so that AI agents/models (Claude, Cursor, Codex, Windsurf, Cline, etc.) can interact with that
website's data/features through standardized MCP tools.

## GOAL (One Line)
`Input: Website URL` → `Output: Installable/Hostable MCP Server exposing that site's capabilities as tools`

---

## 1. CORE PROBLEM

Most websites do NOT expose a public API or MCP server. But their frontend still talks to 
*some* backend (hidden JSON endpoints) OR is fully server-rendered HTML. We need to:

1. Reverse-engineer how the site actually works (hidden APIs, forms, search, pagination, auth).
2. Convert discovered behavior into structured "capabilities".
3. Auto-generate MCP server code implementing those capabilities as `tools`.
4. Package/host it so it works with Claude Desktop, Cursor, Codex CLI, Windsurf, etc.

---

## 2. HIGH-LEVEL PIPELINE
User submits URL
│
▼
[1] Site Crawler & Mapper
│ (sitemap.xml, robots.txt, internal links, depth-limited crawl)
▼
[2] Agentic Browser Explorer (Playwright + LLM, vision-capable)
│ - Opens site in headless browser
│ - Identifies interactive elements: search bar, filters, forms,
│ login, pagination, product/article cards, detail pages
│ - Performs sample interactions (search "test", click filters, open detail page)
▼
[3] Network Interceptor (Hidden API Discovery)
│ - Records all XHR/fetch calls during interactions
│ - Extracts: method, URL pattern, query/body params, headers,
│ auth tokens/cookies, JSON response schema
│ - Classifies: REST-like / GraphQL / server-rendered-only
▼
[4] Capability Synthesizer (LLM reasoning step)
│ - Merges DOM understanding + network data
│ - Produces a "Capability Spec" (structured JSON) — see Section 5
▼
[5] Execution Strategy Selector (per capability)
│ - If clean hidden API found → strategy = "api-call"
│ - Else → strategy = "browser-automation" (Playwright script)
▼
[6] MCP Code Generator (deterministic templating, NOT LLM freeform)
│ - Converts each capability into an MCP tool definition + implementation
▼
[7] Validator / Self-Healing Layer
│ - Runs generated tools with sample inputs
│ - LLM checks if output matches expected semantic result
│ - If broken (selector/endpoint changed) → re-run discovery for that tool only
▼
[8] Packager & Multi-Client Installer
│ - Local package (stdio transport) for Claude Desktop/Cursor/Codex
│ - Hosted remote MCP endpoint (Streamable HTTP/SSE transport) — recommended default
▼
Output: Working MCP Server (URL to add OR downloadable package)

text


---

## 3. TECH STACK

| Layer | Choice |
|---|---|
| Backend | Node.js (TypeScript) — primary, since MCP SDK & Playwright have first-class support |
| Browser Automation | Playwright (headless Chromium) |
| MCP SDK | `@modelcontextprotocol/sdk` (official) |
| LLM (Analysis/Reasoning) | Claude (Sonnet) or GPT-4o — vision + reasoning capable, used ONLY in discovery phase |
| Job Queue | BullMQ + Redis (for async site analysis jobs — can take 30s–3min) |
| DB | PostgreSQL (store site analysis results, capability specs, generated servers) |
| Storage | S3-compatible (generated packages, screenshots, HAR files) |
| Frontend | Next.js + Tailwind (dashboard: paste URL → progress → result) |
| Hosting for Generated MCP Servers | Multi-tenant Node.js runtime, one route per generated server: `/mcp/:siteId` (Streamable HTTP transport) |
| Sandbox | Run generated browser-automation tools inside isolated container (Docker) per request — security |

---

## 4. FOLDER STRUCTURE (Main Platform Repo)
mcp-forge/
├── apps/
│ ├── web/ # Next.js dashboard (user-facing)
│ └── api/ # Main backend API (job orchestration)
├── packages/
│ ├── crawler/ # Site mapper (sitemap, robots.txt, link graph)
│ ├── explorer-agent/ # Playwright + LLM agentic browsing
│ ├── network-interceptor/ # HAR capture + endpoint pattern extraction
│ ├── capability-synth/ # LLM-based capability spec generator
│ ├── mcp-codegen/ # Deterministic template engine → MCP server code
│ ├── validator/ # Runs & tests generated tools, self-heals
│ └── mcp-runtime/ # Multi-tenant host for generated MCP servers (SSE/HTTP)
├── templates/
│ └── mcp-server-template/ # Base scaffold used by codegen (Node + MCP SDK)
├── generated-servers/ # Output: one folder per generated MCP server
└── agent.md # This file

text


---

## 5. CAPABILITY SPEC (Intermediate Representation)

Every analyzed website is converted into this JSON before code generation.
This is the CONTRACT between discovery phase and codegen phase.

```json
{
  "site": {
    "url": "https://example-store.com",
    "name": "Example Store",
    "authRequired": false,
    "rateLimitHintMs": 800
  },
  "capabilities": [
    {
      "toolName": "search_products",
      "description": "Search products by keyword, optional category and price filter",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": { "type": "string", "description": "search keyword" },
          "category": { "type": "string", "description": "optional category filter" },
          "maxPrice": { "type": "number" }
        },
        "required": ["query"]
      },
      "outputSchema": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "title": { "type": "string" },
            "price": { "type": "number" },
            "url": { "type": "string" },
            "image": { "type": "string" }
          }
        }
      },
      "executionStrategy": "api-call",
      "apiTemplate": {
        "method": "GET",
        "urlPattern": "https://example-store.com/api/search?q={{query}}&cat={{category}}",
        "headers": { "Accept": "application/json" },
        "responsePath": "data.results"
      }
    },
    {
      "toolName": "get_product_details",
      "description": "Fetch full details of a product by its page URL",
      "inputSchema": {
        "type": "object",
        "properties": { "productUrl": { "type": "string" } },
        "required": ["productUrl"]
      },
      "executionStrategy": "browser-automation",
      "browserScript": {
        "actions": [
          { "type": "goto", "target": "{{productUrl}}" },
          { "type": "extract", "selectorGroup": "product-detail-v1" }
        ]
      }
    }
  ]
}
6. MCP SERVER CODE GENERATION RULES
Use @modelcontextprotocol/sdk Server class.

Support both transports:

StdioServerTransport → for local install in Claude Desktop / Cursor / Codex CLI.
StreamableHTTPServerTransport → for hosted/remote usage (no install needed, just paste URL).
Each capability → one MCP tool:

TypeScript

server.tool(
  "search_products",
  "Search products by keyword, optional category and price filter",
  { query: z.string(), category: z.string().optional(), maxPrice: z.number().optional() },
  async ({ query, category, maxPrice }) => {
    // if executionStrategy === "api-call" → fetch() using apiTemplate
    // if executionStrategy === "browser-automation" → run Playwright script
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);
Always sanitize/validate inputs with zod.

Add rate limiting + retry with backoff for every generated tool.

Add caching (short TTL) for read-only GET-like tools to reduce load on target site.

Respect robots.txt — disable/flag tools that hit disallowed paths.

Never auto-generate tools for destructive actions (checkout/payment/delete) unless
explicitly confirmed by user during generation review step.

7. AUTH / SESSION HANDLING
Detect if site needs login to access target data (compare logged-out vs "guest" crawl results).

If yes:

Offer user a one-time "connect account" flow → Playwright opens real browser window,
user logs in manually, session cookies/localStorage captured and encrypted (AES-256) at rest.
Store per-user credentials/sessions separately — NEVER shared across tenants.
Auto-refresh session; if expired, tool call returns clear error asking user to reconnect.
8. SELF-HEALING VALIDATOR
After generation, run each tool with 1–2 sample inputs.

Compare output against expected schema + LLM sanity check ("does this look like real
product data or an error page?").

If a browser-automation tool fails (selector not found):

Re-screenshot + re-extract DOM.
Ask LLM: "Given this page, find the element that represents X" → get new selector.
Patch the specific tool's script, re-test, save fix.
Schedule periodic re-validation (e.g. daily/weekly cron) since sites change over time —
auto re-heal broken tools without user intervention.

9. MULTI-CLIENT INSTALL SUPPORT
Generate ready-to-copy config snippets for each client automatically in the dashboard result page:

Claude Desktop (claude_desktop_config.json):

JSON

{
  "mcpServers": {
    "example-store": {
      "command": "npx",
      "args": ["-y", "mcp-forge-server@latest", "--site=example-store"]
    }
  }
}
Cursor (.cursor/mcp.json):

JSON

{
  "mcpServers": {
    "example-store": { "url": "https://mcpforge.app/mcp/example-store" }
  }
}
Codex CLI / Windsurf / Cline: same pattern — either stdio command or remote URL,
depending on transport chosen. Auto-generate both options in the UI with copy buttons.

10. SECURITY & ETHICS CONSTRAINTS (MUST FOLLOW)
Respect robots.txt disallow rules by default (toggle for advanced users, with warning).
Rate-limit all generated tools to avoid hammering target sites (configurable, default 1 req/sec).
Never bypass CAPTCHAs, paywalls, or anti-bot protections through evasion techniques.
Clearly disclose in generated README: "This MCP server was auto-generated by scraping
publicly available site behavior; user is responsible for complying with the target
site's Terms of Service."
No generation of tools for login-bypass, credential stuffing, or destructive actions
without explicit human confirmation.
Sandbox all browser-automation execution (per-request Docker container) — never run
arbitrary generated scripts on host machine directly.
11. BUILD PHASES (Execute in Order)
Phase 1 — Scaffolding: Monorepo setup (pnpm workspaces), base Next.js dashboard, base MCP template.
Phase 2 — Crawler: Sitemap/robots parser + depth-limited link crawler.
Phase 3 — Explorer Agent: Playwright + LLM vision loop to identify interactive elements.
Phase 4 — Network Interceptor: HAR capture + endpoint pattern miner.
Phase 5 — Capability Synthesizer: LLM prompt chain → produces Capability Spec JSON (validate against JSON Schema).
Phase 6 — Codegen Engine: Template-based generator (Capability Spec → working TS MCP server).
Phase 7 — Validator/Self-Healing: Automated test runner + LLM sanity checker + auto-patch loop.
Phase 8 — Multi-Tenant Runtime: Host generated servers under /mcp/:siteId with Streamable HTTP transport.
Phase 9 — Dashboard UX: URL input → live progress (crawling → discovering → generating → validating) → result page with install snippets.
Phase 10 — Auth/Sessions Module: Manual login capture flow + encrypted storage.
Phase 11 — Monitoring: Daily health-check cron for all generated servers + auto re-heal + email/alert on unfixable break.
Phase 12 — Billing/Quota (optional, later): Usage-based limits per generated server (API calls, browser-automation minutes).
12. DEFINITION OF DONE (MVP)
 User can paste any website URL on dashboard.
 System discovers at least "search" + "detail view" capability for typical content sites.
 Generates working MCP server (stdio + remote URL both).
 Verified working when added to Claude Desktop AND Cursor.
 Handles both API-based and pure-HTML/browser-automation-based sites.
 Self-heals at least simple selector-based breakages automatically.
 Respects robots.txt and applies rate limiting by default.
13. NOTES FOR AGENT EXECUTION
Prefer official @modelcontextprotocol/sdk and @modelcontextprotocol/inspector
(for local testing of generated servers before deployment).
Use playwright.chromium.launch({ headless: true }) with stealth-safe defaults.
Keep LLM usage isolated to discovery/reasoning steps only — code generation itself
must be deterministic/templated for reliability and reproducibility.
Log every discovery decision (why a capability was created, from which evidence) for
debuggability and for regenerating/fixing later without re-running full analysis.
# AGENT-MVP.md — MCP Forge (Proof-of-Concept Scope)

## ROLE
You are an autonomous full-stack + AI systems engineer agent. Build a **minimal but real 
working proof-of-concept** of "MCP Forge" — a tool that takes a website URL and generates 
a working, hosted MCP server for it. This MVP version is intentionally scoped down 
(Phases 1–6 only) to prove the core concept fast before building the full platform.

## GOAL
`Input: Website URL` → `Output: A hosted, remote MCP server (URL) that user can paste 
directly into Claude/Cursor and immediately query the site's search + detail-page data.`

---

## ⚠️ CRITICAL STRATEGY NOTES (Follow These Priorities Strictly)

### 1. Hidden API Discovery FIRST — this is priority #1
Most modern websites (React/Next.js/Vue-based, JS-heavy) internally call their own 
JSON APIs in the background even though they don't publish any public API docs.
- Use Playwright to load the site and **sniff all network requests (XHR/fetch)** while 
  performing actions (typing in search bar, clicking filters, opening a product/article).
- This is the **fastest, most reliable, and lowest-maintenance** method — always try 
  this before falling back to browser automation.
- If a clean JSON endpoint is found (e.g. `/api/search?q=...`), generate an `api-call` 
  based MCP tool. This is 10x more stable than scraping HTML/DOM.

### 2. Browser-Automation = Fallback ONLY
- Only use Playwright-based scraping (reading DOM, clicking, extracting text/selectors) 
  when:
  - Site is fully server-rendered (no JSON APIs found in network tab), OR
  - Content is generated purely via server-side HTML with no client-side data fetching.
- Browser-automation tools are slower + more fragile (break when HTML changes) — 
  treat them as last resort, not default.

### 3. Start Testing On Predictable Site Types
For the MVP, **only test/validate against these categories first**:
- E-commerce sites (search products, view product detail)
- Blogs (search/list posts, view full post)
- News sites (list articles, view article)
- Directory/listing sites (search entries, view entry detail)

These have a very predictable pattern: **search/list → detail page**, which makes it 
much easier for the discovery agent to learn a repeatable strategy. Do NOT test on 
complex apps (SaaS dashboards, banking, multi-step checkout flows) in this MVP phase.

### 4. Remote MCP (Hosted URL) — Default & ONLY Approach for MVP
- Skip local/stdio install (`npx` command) complexity entirely for now.
- Every generated MCP server should be hosted at `https://mcpforge.app/mcp/:siteId` 
  using **Streamable HTTP transport**.
- User experience should be: paste URL on dashboard → wait → get a link → 
  paste that link into Claude/Cursor's MCP settings. That's it. No downloads, 
  no terminal commands, no npx.
- This drastically lowers the barrier for non-technical users testing the MVP.

### 5. Study Reference Implementations Before Coding
Before writing the discovery agent or codegen engine, review:
- **Microsoft's Playwright MCP** (`@playwright/mcp`) — study how they structure 
  browser-driven MCP tools, their action/extraction patterns, and transport setup.
- **Official MCP SDK docs & examples** (`@modelcontextprotocol/sdk`, 
  `@modelcontextprotocol/inspector`) — study their `server.tool()` patterns, 
  Zod schema usage, and both stdio + StreamableHTTP transport examples.
- Reuse their patterns/conventions wherever possible instead of inventing new ones — 
  this ensures generated servers are spec-compliant and compatible across all clients.

---

## MVP PIPELINE (Simplified — Phases 1–6 Only)
User submits URL (must be one of: ecommerce / blog / news / directory)
│
▼
[1] Mini Crawler

Fetch sitemap.xml / robots.txt if available
Identify: homepage, a search/listing page, a few detail pages (shallow crawl, depth ≤2)
▼
[2] Network Sniffing Explorer (Playwright)
Load listing/search page in headless browser
Perform 1 sample search + open 1 detail page
Record ALL XHR/fetch calls (URL, method, params, headers, JSON response) via CDP/HAR
▼
[3] Endpoint Classifier
IF clean JSON API found for search & detail → mark strategy = "api-call" (PREFERRED)
ELSE → mark strategy = "browser-automation" (fallback), capture selectors for
title/price/image/description/link fields
▼
[4] Capability Spec Generator (LLM step)
Produce a JSON spec with exactly 2 tools minimum:
search_<site> (list/search capability)
get_<site>_detail (detail page capability)
Follow the same JSON schema format as defined in full agent.md Section 5
▼
[5] MCP Codegen (Deterministic Template)
Generate a TypeScript MCP server using @modelcontextprotocol/sdk
Implement both tools using either fetch() (api-call) or Playwright (browser-automation)
Use Zod for input validation
Add basic rate-limiting (1 req/sec default) + robots.txt respect check
▼
[6] Deploy & Return
Deploy generated server on multi-tenant runtime → https://mcpforge.app/mcp/{siteId}
Run 1 quick sanity test call on each tool before returning success to user
Show user: hosted URL + copy-paste config snippet for Claude Desktop & Cursor
text


---

## TECH STACK (MVP — Keep It Minimal)

| Layer | Choice |
|---|---|
| Backend | Node.js + TypeScript |
| Browser Automation / Network Sniffing | Playwright (headless Chromium) |
| MCP SDK | `@modelcontextprotocol/sdk` (reference: `@modelcontextprotocol/inspector` for local testing, Microsoft `@playwright/mcp` for pattern reference) |
| LLM (discovery/classification reasoning only) | Claude Sonnet or GPT-4o |
| DB | SQLite or PostgreSQL (just to store site → capability spec → generated server mapping) |
| Frontend | Simple Next.js single page: URL input → progress log → result (hosted link + config snippets) |
| Hosting | Single Node.js process, multi-tenant route `/mcp/:siteId` using StreamableHTTPServerTransport |

**Skip for MVP (add later in full version):** job queues, Docker sandboxing, self-healing 
validator, auth/session capture, multi-tenant billing, local stdio packaging.

---

## MVP CAPABILITY SPEC (Only 2 Tools Required)

```json
{
  "site": { "url": "https://example-blog.com", "name": "Example Blog" },
  "capabilities": [
    {
      "toolName": "search_posts",
      "description": "Search blog posts by keyword",
      "inputSchema": {
        "type": "object",
        "properties": { "query": { "type": "string" } },
        "required": ["query"]
      },
      "executionStrategy": "api-call",
      "apiTemplate": {
        "method": "GET",
        "urlPattern": "https://example-blog.com/wp-json/wp/v2/posts?search={{query}}",
        "responsePath": "$"
      }
    },
    {
      "toolName": "get_post_detail",
      "description": "Get full content of a blog post by its URL",
      "inputSchema": {
        "type": "object",
        "properties": { "postUrl": { "type": "string" } },
        "required": ["postUrl"]
      },
      "executionStrategy": "browser-automation",
      "browserScript": {
        "actions": [
          { "type": "goto", "target": "{{postUrl}}" },
          { "type": "extract", "selectors": { "title": "h1", "content": "article" } }
        ]
      }
    }
  ]
}
FOLDER STRUCTURE (MVP)
text

mcp-forge-mvp/
├── apps/
│   ├── web/                # Next.js: URL input + progress + result page
│   └── api/                # Express/Fastify: orchestrates the 6-phase pipeline
├── packages/
│   ├── crawler-mini/        # Sitemap/robots + shallow link discovery
│   ├── network-sniffer/     # Playwright network interception logic
│   ├── capability-synth/    # LLM prompt → Capability Spec JSON
│   └── mcp-codegen/         # Template engine → generates MCP server .ts file
├── mcp-runtime/              # Hosts all generated servers under /mcp/:siteId
├── generated-servers/        # Output folder, one .ts file per site
└── agent-mvp.md
DEFINITION OF DONE (MVP)
 User pastes a URL of an e-commerce/blog/news/directory site.
 System successfully sniffs at least ONE real hidden JSON API endpoint (search or listing).
 If no JSON API found, falls back to browser-automation and still produces working tools.
 Generates a working MCP server with exactly 2 tools: search + detail view.
 Server is hosted and reachable at https://mcpforge.app/mcp/{siteId}.
 Successfully tested by adding the URL into Claude Desktop and Cursor —
agent can call search_x and get_x_detail and get real data back.
 Respects robots.txt, applies basic 1 req/sec rate limit.
BUILD ORDER (Do exactly in this sequence)
Set up base Next.js dashboard with a single URL input + "Generate" button (no design polish needed yet).
Build network-sniffer: Playwright script that opens a URL, performs a search, records all network calls to a HAR-like JSON.
Build endpoint classifier: simple logic + LLM check to decide if a clean JSON API exists in recorded network calls.
Build capability-synth: LLM prompt that takes crawler + sniffer output and produces the 2-tool Capability Spec JSON (validate against schema).
Build mcp-codegen: template that takes Capability Spec JSON → outputs a working .ts MCP server file using @modelcontextprotocol/sdk (study Playwright MCP + official SDK examples for exact patterns).
Build mcp-runtime: minimal Express server that dynamically loads generated .ts/.js files and serves them via StreamableHTTPServerTransport at /mcp/:siteId.
Test end-to-end manually on 3 sample sites: one WordPress blog, one small e-commerce store, one news site.
Connect result page to show copy-paste config for Claude Desktop (mcpServers with url) and Cursor (.cursor/mcp.json).
Once working reliably on 3+ test sites → move to full agent.md roadmap (self-healing, auth, multi-tenant scaling, etc).
NOTES
Keep LLM usage minimal and ONLY for: (a) classifying whether an endpoint is a real API,
(b) generating the Capability Spec JSON. Everything else (actual code generation) must
be deterministic templating — no LLM writing raw server code freeform.
Log every discovered network request during sniffing (even ones you don't use) —
useful for debugging later when expanding to more tools per site.
Always respect robots.txt and add rate-limiting from day 1, even in MVP — don't skip this.
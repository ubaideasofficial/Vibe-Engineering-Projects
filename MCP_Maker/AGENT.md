1. Mission
Build a web application that accepts a website URL, analyzes its public pages, and automatically generates a Model Context Protocol (MCP) server for that website. The generated MCP server must:

Work without any official API by using only legal, public, anonymous data.
Be compatible with any MCP client: Claude Desktop, Cursor, Codex, etc.
Respect robots.txt, Terms of Service, and rate limits.
Provide accurate structured data via MCP tools/resources.
Be deployable on Vercel free tier for MVP (no paid services required).
2. Non-Negotiable Constraints
2.1 Legal Only (Critical)
Only access public, anonymous web pages.
Always parse and obey robots.txt.
Respect noindex, X-Robots-Tag, and canonical rules.
No bypassing CAPTCHA, login, paywall, or anti-bot protections.
No scraping of personal data unless explicitly public and allowed.
Honor rate limits; implement exponential backoff with jitter.
Read and respect Terms of Service. If ToS prohibits automated access, refuse to generate a scraper and explain why.
Generated MCP servers must include a config option for robots.txt checking and rate limiting.
2.2 Accuracy First
Prefer structured data: JSON-LD, Microdata, RDFa, Open Graph, Twitter Cards, meta tags.
Use semantic HTML landmarks and ARIA roles.
Validate all extracted data with Zod schemas.
Allow users to preview and edit extracted schema/mappings before generating.
Never hallucinate data; if uncertain, return null / undefined.
3. MVP Features (Vercel Free Deployable)
Feature	Description
Input	URL field + optional user instructions (e.g., "only blog posts", "include product search")
Analyze	Fetch homepage + sample pages, detect site type, extract sitemap, robots, RSS, main entities (products, articles, etc.)
Generate MCP Server	Create a standalone Node.js/TypeScript project using @modelcontextprotocol/sdk
Download	Offer downloadable zip. Display config snippet for Claude Desktop, Cursor, Codex.
Dashboard	Store generated projects briefly, allow re-generation, edit config (simple persistence).
Note: No user authentication required for MVP. Data may be stored in Vercel Postgres free tier or simple serverless storage.

4. Simplified Technical Architecture (Free Tier Only)
4.1 Tech Stack
Layer	Technology
Frontend	Next.js 14 App Router, React, Tailwind CSS, shadcn/ui
Backend	Next.js API Routes/Route Handlers, TypeScript
Database	Vercel Postgres (free tier) – only for project status, no heavy usage
Scraping	cheerio (static HTML), robots-parser
MCP SDK	@modelcontextprotocol/sdk (TypeScript)
Code Generation	Handlebars/string templates + archiver for zip
Hosting	Vercel (Hobby plan – free)
4.2 High-Level Flow
text

User submits URL
        ↓
Validate URL + check robots.txt + fetch homepage
        ↓
Crawler discovers up to N pages (default 10) respecting robots/rate limits
        ↓
Analyzer extracts structured data and URL patterns
        ↓
Generator creates MCP server code from templates
        ↓
User previews, downloads zip
        ↓
Generated MCP server works locally with any MCP client (stdio only)
4.3 Folder Structure (Simplified)
text

apps/
  web/                 # Next.js frontend + API
  mcp-template/        # Base template for generated MCP servers
packages/
  analyzer/            # Website crawling & analysis logic
  generator/           # MCP code generation
  legal/               # robots.txt, ToS checker, rate limiter
5. Implementation Phases (MVP only)
Phase 1: Research & Spiking
Study MCP specification: https://modelcontextprotocol.io
Understand MCP stdio transport only (local use).
Build a minimal MCP server using @modelcontextprotocol/sdk.
Test with Claude Desktop, Cursor, Codex.
Research legal scraping: robots.txt, rate limiting, ToS.
Phase 2: Core Analyzer
Implement analyzeWebsite(url):

Validate URL format.
Fetch robots.txt and parse allowed/disallowed paths.
Fetch homepage using fetch with a proper User-Agent header.
Parse HTML with cheerio.
Extract:
Title, description, canonical URL.
Open Graph/Twitter meta.
JSON-LD blocks (Product, Article, Organization, Breadcrumb, etc.).
Links grouped by URL pattern.
Sitemap URLs from robots.txt and common paths.
Fetch sitemap if found, parse URLs.
Classify site type using heuristics (no external LLM required).
Return a structured SiteProfile.
Phase 3: Legal Compliance Module
Create legal.ts:

TypeScript

checkRobots(url, path)      // use robots-parser
checkNoIndex(html, headers) // check meta robots and X-Robots-Tag
checkTerms(url)             // fetch /terms or /legal and scan for "scraping", "automated access"
rateLimit(fn, { maxRequests, perMilliseconds })
backoff                     // exponential backoff with jitter
Store all legal checks in memory/database for audit.
If robots.txt disallows a path, generated MCP server will never access it.
Phase 4: MCP Code Generator
Create a base MCP template with:

package.json dependencies: @modelcontextprotocol/sdk, zod, cheerio, robots-parser.
tsconfig.json.
src/index.ts with MCP server initialization.
Tools abstractions.
Tools to include based on detected site type:

Site Type	Tools
Common	get_page, get_sitemap, get_robots, search_site
E-commerce	search_products, get_product, list_categories
Blog/Docs	list_articles, get_article, search_articles
Directory	list_entries, search_entries
Each tool implementation must:

Use fetch with user-agent, rate limiting, and robots check.
Parse HTML with cheerio.
Extract structured JSON based on generated selectors.
Return JSON string or structured content.
Generate a README.md with installation instructions for Claude Desktop, Cursor, Codex.
Generate a config.json for user-adjustable settings: baseUrl, rateLimitMs, maxPages, userAgent.

Phase 5: Frontend & Dashboard
Pages:

/ → Landing + URL input.
/app → Dashboard (list projects).
/app/[id] → Project detail: analysis results, code preview, download.
Phase 6: Deploy on Vercel (Free)
Set up Next.js project on Vercel.
Use Vercel Postgres (free) for storing project metadata (no heavy queries).
API routes:
TypeScript

POST /api/analyze             // starts analysis, returns job ID
GET  /api/analyze/[jobId]     // poll status
POST /api/generate            // starts generation
GET  /api/project/[id]/download  // download zip
Ensure rate limiting on API routes using simple in-memory or Vercel's edge config.
Keep serverless functions small and under free tier limits.
6. Data Models (Minimal)
TypeScript

Project {
  id string
  url string
  siteType string
  analysisJson json
  generatedCodePath string (Vercel Blob URL or base64 string)
  configJson json
  status enum (pending, analyzing, generating, ready, failed)
  createdAt Date
  updatedAt Date
}
No user model required if auth is skipped.

7. Security Requirements (Still Important)
All user inputs sanitized and validated.
URL SSRF protection: block private IPs, localhost, metadata endpoints. Use ip-address checks and DNS rebinding protection.
Rate limit all APIs (simple in-memory or headers based).
Generated MCP servers must not include secrets in code; use environment variables.
Log all scrape attempts for audit.
Add a User-Agent string identifying the tool and contact info; allow website owners to block via robots.
8. Testing Plan
Unit tests for legal module, parser, generator.
Integration tests with mock HTML and real public sites (e.g., example.com).
E2E tests with Playwright for frontend.
Test generated MCP servers against Claude Desktop/Cursor/Codex manually.
9. MVP Deliverables
Working Next.js app on Vercel (free).
Users can enter URL, analyze, generate MCP server zip.
Generated server works locally with at least one MCP client (stdio).
Legal guardrails in place.
Simple documentation on how to use.
10. Key Files to Create First
packages/legal/robots.ts
packages/analyzer/index.ts
packages/generator/templates/mcp-server/
apps/web/app/api/analyze/route.ts
apps/web/app/page.tsx
11. Final Notes to Agent
Always prioritize legal compliance over functionality. If a website cannot be accessed legally, reject the request and explain why.
Keep the generated MCP server simple, well-documented, and secure.
This is a "safe scraper generator" that produces MCP-compliant data tools for local use.
No remote MCP hosting, no payments, no scaling – just MVP on Vercel free.

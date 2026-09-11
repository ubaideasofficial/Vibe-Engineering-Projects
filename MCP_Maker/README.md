# MCP Forge

MCP Forge turns a public website into a read-only MCP server with search and detail tools.

## Local setup

```powershell
npm install
npx playwright install chromium
Copy-Item .env.example .env
# Put your OpenRouter credential in .env
npm run dev
```

The dashboard runs on `http://localhost:3000`; the API and MCP runtime run on `http://localhost:4000`.

The generator fetches robots.txt, maps public links, records JSON XHR/fetch traffic with Playwright, classifies endpoints, asks OpenRouter for a validated two-tool capability spec, persists that spec under `data/sites.json`, and serves the generated tools at `/mcp/:siteId`.

The generated tools are read-only, rate-limited to one request per second per origin, cached briefly, and refuse paths disallowed by robots.txt. Browser discovery and browser-backed tools require the Playwright Chromium install above.

## Client configuration

For a generated remote URL, add this to Cursor `.cursor/mcp.json` or a compatible HTTP MCP client:

```json
{
  "mcpServers": {
    "mcpforge-site": {
      "url": "http://localhost:4000/mcp/<siteId>"
    }
  }
}
```

## Responsibility and limits

This MCP server is auto-generated from publicly available site behavior. Users are responsible for complying with the target site's Terms of Service, robots.txt, rate limits, and applicable law. MCP Forge does not bypass CAPTCHAs, paywalls, authentication, or anti-bot protections. Authentication/session capture, destructive actions, Docker sandboxing, and self-healing validation are not enabled in this local MVP.

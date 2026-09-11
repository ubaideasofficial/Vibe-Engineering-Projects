import { capabilitySpecSchema, type CapabilitySpec } from "@mcp-forge/core";
import type { CrawlResult } from "@mcp-forge/crawler";
import type { Classification } from "@mcp-forge/endpoint-classifier";
import type { NetworkRecord } from "@mcp-forge/network-sniffer";

type SynthesisInput = { crawl: CrawlResult; classification: Classification; records: NetworkRecord[] };

function fallbackSpec(input: SynthesisInput): CapabilitySpec {
  const searchUrl = input.classification.search?.url ?? `${input.crawl.url.replace(/\/$/, "")}/?s={{query}}`;
  const detailUrl = input.classification.detail?.url ?? `${input.crawl.url.replace(/\/$/, "")}/{{url}}`;
  const api = Boolean(input.classification.search || input.classification.detail);
  return capabilitySpecSchema.parse({
    site: { url: input.crawl.url, name: input.crawl.name, authRequired: false, rateLimitHintMs: 1000 },
    capabilities: [
      { toolName: `search_${slug(input.crawl.name)}`, description: `Search ${input.crawl.name} by keyword`, inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] }, executionStrategy: api ? "api-call" : "browser-automation", ...(api ? { apiTemplate: { method: "GET", urlPattern: searchUrl, headers: { Accept: "application/json" } } } : { browserScript: { urlPattern: searchUrl, selectors: { title: "title", content: "body" } } }) },
      { toolName: `get_${slug(input.crawl.name)}_detail`, description: `Read a detail page from ${input.crawl.name}`, inputSchema: { type: "object", properties: { url: { type: "string" } }, required: ["url"] }, executionStrategy: api ? "api-call" : "browser-automation", ...(api ? { apiTemplate: { method: "GET", urlPattern: detailUrl, headers: { Accept: "application/json" } } } : { browserScript: { urlPattern: "{{url}}", selectors: { title: "h1", content: "article, main, body" } } }) }
    ]
  });
}

function slug(value: string): string { return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 24) || "site"; }

export async function synthesizeCapabilities(input: SynthesisInput): Promise<CapabilitySpec> {
  const key = process.env.OPEN_ROUTER_API_KEY;
  if (!key) return fallbackSpec(input);
  const prompt = `Return JSON only matching this contract: {site:{url,name,authRequired,rateLimitHintMs},capabilities:[exactly two items with toolName,description,inputSchema,executionStrategy,apiTemplate or browserScript]}. Prefer api-call only when evidence supports it. Crawl: ${JSON.stringify(input.crawl)} Network: ${JSON.stringify(input.records.slice(0, 8))} Classification: ${JSON.stringify(input.classification)}`;
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "HTTP-Referer": "http://localhost:3000", "X-Title": "MCP Forge" }, body: JSON.stringify({ model: process.env.OPEN_ROUTER_MODEL ?? "nvidia/nemotron-3.5-lightning", temperature: 0, response_format: { type: "json_object" }, messages: [{ role: "system", content: "You design safe read-only website capabilities. Never propose login bypass, destructive actions, CAPTCHA evasion, or private data access." }, { role: "user", content: prompt }] }) });
  if (!response.ok) throw new Error(`OpenRouter synthesis failed with HTTP ${response.status}`);
  const body = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = body.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenRouter returned no capability specification");
  try {
    return capabilitySpecSchema.parse(JSON.parse(content));
  } catch {
    return fallbackSpec(input);
  }
}
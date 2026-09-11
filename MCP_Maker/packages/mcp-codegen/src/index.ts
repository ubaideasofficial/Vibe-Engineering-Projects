import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { chromium } from "playwright";
import { isDisallowed } from "@mcp-forge/crawler";
import { assertPublicHostname, safeFetch, type CapabilitySpec } from "@mcp-forge/core";
import { z } from "zod";

const lastRequest = new Map<string, number>();
const cache = new Map<string, { expires: number; value: unknown }>();

function inputShape(capability: CapabilitySpec["capabilities"][number]): Record<string, z.ZodTypeAny> {
  const properties = (capability.inputSchema.properties ?? {}) as Record<string, { type?: string }>;
  const required = new Set((capability.inputSchema.required ?? []) as string[]);
  return Object.fromEntries(Object.entries(properties).map(([key, value]) => { const schema = value.type === "number" ? z.number() : z.string(); return [key, required.has(key) ? schema : schema.optional()]; }));
}

export function applyTemplate(template: string, args: Record<string, unknown>): string {
  const wholePlaceholder = template.match(/^{{(\w+)}}$/);
  if (wholePlaceholder) return String(args[wholePlaceholder[1]] ?? "");
  return template.replace(/{{(\w+)}}/g, (_, key: string) => encodeURIComponent(String(args[key] ?? "")));
}

async function execute(capability: CapabilitySpec["capabilities"][number], args: Record<string, unknown>, disallowedPaths: string[]): Promise<unknown> {
  const template = capability.apiTemplate?.urlPattern ?? capability.browserScript?.urlPattern;
  if (!template) throw new Error("Capability has no execution template");
  const target = applyTemplate(template, args);
  const url = new URL(target);
  if (isDisallowed(url.pathname, disallowedPaths)) throw new Error("robots.txt disallows this path");
  const previous = lastRequest.get(url.origin) ?? 0;
  const wait = 1000 - (Date.now() - previous);
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  lastRequest.set(url.origin, Date.now());
  const key = `${capability.toolName}:${target}`;
  const hit = cache.get(key); if (hit && hit.expires > Date.now()) return hit.value;
  let result: unknown;
  if (capability.executionStrategy === "api-call" && capability.apiTemplate) {
    const response = await safeFetch(target, { method: capability.apiTemplate.method, headers: capability.apiTemplate.headers, signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Target returned HTTP ${response.status}`);
    result = await response.json();
  } else if (capability.browserScript) {
    await assertPublicHostname(url.hostname);
    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage();
      await page.goto(target, { waitUntil: "domcontentloaded", timeout: 30000 });
      await assertPublicHostname(new URL(page.url()).hostname);
      result = { title: await page.locator(capability.browserScript.selectors.title ?? "title").first().textContent(), content: await page.locator(capability.browserScript.selectors.content ?? "body").first().textContent() };
    } finally { await browser.close(); }
  }
  cache.set(key, { expires: Date.now() + 30000, value: result });
  return result;
}

export function createGeneratedServer(spec: CapabilitySpec, disallowedPaths: string[]): McpServer {
  const server = new McpServer({ name: spec.site.name, version: "0.1.0" });
  for (const capability of spec.capabilities) server.registerTool(capability.toolName, { description: capability.description, inputSchema: inputShape(capability) }, async (args) => { const result = await execute(capability, args as Record<string, unknown>, disallowedPaths); return { content: [{ type: "text", text: JSON.stringify(result) }] }; });
  return server;
}
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { LocalJobRepository, LocalSiteRepository, createMcpToken, hashMcpToken } from "../src/index.js";

const spec = { site: { url: "https://example.com", name: "Example", authRequired: false, rateLimitHintMs: 1000 }, capabilities: [{ toolName: "search_example", description: "Search", inputSchema: {}, executionStrategy: "browser-automation" as const, browserScript: { urlPattern: "https://example.com", selectors: { content: "body" } } }, { toolName: "get_example_detail", description: "Detail", inputSchema: {}, executionStrategy: "browser-automation" as const, browserScript: { urlPattern: "https://example.com", selectors: { content: "body" } } }] };

test("local site repository survives a reload and enforces ownership", async () => {
  const directory = await mkdtemp(join(tmpdir(), "mcp-forge-"));
  const path = join(directory, "sites.json");
  const site = { siteId: "site-1", ownerId: "user-1", spec, disallowedPaths: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  const first = new LocalSiteRepository(path); await first.load(); await first.save(site);
  const second = new LocalSiteRepository(path); await second.load();
  assert.equal((await second.get("site-1", "user-1"))?.spec.site.name, "Example");
  assert.equal(await second.get("site-1", "user-2"), undefined);
  await rm(directory, { recursive: true, force: true });
});

test("local job repository survives a reload", async () => {
  const directory = await mkdtemp(join(tmpdir(), "mcp-forge-"));
  const path = join(directory, "jobs.json");
  const job = { id: "job-1", ownerId: "user-1", url: "https://example.com", siteType: "blog" as const, status: "ready" as const, events: [] };
  const first = new LocalJobRepository(path); await first.load(); await first.save(job);
  const second = new LocalJobRepository(path); await second.load(); assert.equal((await second.get("job-1", "user-1"))?.status, "ready");
  await rm(directory, { recursive: true, force: true });
});

test("MCP tokens are random and only hashes are persisted", () => {
  const generated = createMcpToken();
  assert.notEqual(generated.token, generated.hash);
  assert.equal(hashMcpToken(generated.token), generated.hash);
  assert.match(generated.token, /^mcp_/);
});
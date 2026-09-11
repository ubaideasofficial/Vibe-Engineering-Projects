import assert from "node:assert/strict";
import { test } from "node:test";
import type { CapabilitySpec, Job } from "@mcp-forge/core";
import type { JobRepository, SiteRepository, StoredSite } from "@mcp-forge/storage";
import type { CrawlResult } from "@mcp-forge/crawler";
import type { NetworkRecord } from "@mcp-forge/network-sniffer";
import { executeGeneration } from "../src/index.js";

class FakeJobRepository implements JobRepository {
  jobs = new Map<string, Job>();
  async load(): Promise<void> {}
  async get(jobId: string, ownerId = "local"): Promise<Job | undefined> {
    const job = this.jobs.get(jobId);
    return job?.ownerId === ownerId ? job : undefined;
  }
  async save(job: Job): Promise<void> {
    this.jobs.set(job.id, structuredClone(job));
  }
  async listByOwner(ownerId: string): Promise<Job[]> {
    return [...this.jobs.values()].filter((job) => job.ownerId === ownerId);
  }
}

class FakeSiteRepository implements SiteRepository {
  sites = new Map<string, StoredSite>();
  async load(): Promise<void> {}
  async get(siteId: string): Promise<StoredSite | undefined> { return this.sites.get(siteId); }
  async save(site: StoredSite): Promise<void> { this.sites.set(site.siteId, site); }
}

const crawlResult: CrawlResult = { url: "https://example.com", name: "Example", robotsTxt: "", disallowedPaths: [], sitemapUrls: [], links: [], detailPages: [] };
const records: NetworkRecord[] = [];
const spec: CapabilitySpec = {
  site: { url: "https://example.com", name: "Example", authRequired: false, rateLimitHintMs: 1000 },
  capabilities: [
    { toolName: "search_example", description: "Search", inputSchema: {}, executionStrategy: "browser-automation", browserScript: { urlPattern: "https://example.com", selectors: { content: "body" } } },
    { toolName: "get_example_detail", description: "Detail", inputSchema: {}, executionStrategy: "browser-automation", browserScript: { urlPattern: "https://example.com", selectors: { content: "body" } } }
  ]
};

test("a fresh job crawls and sniffs once", async () => {
  const jobs = new FakeJobRepository();
  const sites = new FakeSiteRepository();
  let crawlCalls = 0;
  let sniffCalls = 0;
  await executeGeneration({ jobId: "job-1", ownerId: "user-1", url: "https://example.com", siteType: "blog" }, {
    jobs, sites, publicUrl: "https://mcp.test",
    crawl: async () => { crawlCalls += 1; return crawlResult; },
    sniff: async () => { sniffCalls += 1; return records; },
    classify: () => ({ strategy: "browser-automation" }),
    synthesize: async () => spec
  });
  assert.equal(crawlCalls, 1);
  assert.equal(sniffCalls, 1);
  assert.equal((await jobs.get("job-1", "user-1"))?.status, "ready");
});

test("resuming a job that already crawled and sniffed skips those network steps", async () => {
  const jobs = new FakeJobRepository();
  const sites = new FakeSiteRepository();
  await jobs.save({
    id: "job-2", ownerId: "user-1", url: "https://example.com", siteType: "blog", status: "running", events: [],
    checkpoint: { crawl: crawlResult, records }
  });

  let crawlCalls = 0;
  let sniffCalls = 0;
  await executeGeneration({ jobId: "job-2", ownerId: "user-1", url: "https://example.com", siteType: "blog" }, {
    jobs, sites, publicUrl: "https://mcp.test",
    crawl: async () => { crawlCalls += 1; return crawlResult; },
    sniff: async () => { sniffCalls += 1; return records; },
    classify: () => ({ strategy: "browser-automation" }),
    synthesize: async () => spec
  });

  assert.equal(crawlCalls, 0, "crawl should be skipped when a checkpoint already has crawl data");
  assert.equal(sniffCalls, 0, "sniff should be skipped when a checkpoint already has network records");
  assert.equal((await jobs.get("job-2", "user-1"))?.status, "ready");
});

test("a failed step preserves the checkpoint so a retry does not redo completed network work", async () => {
  const jobs = new FakeJobRepository();
  const sites = new FakeSiteRepository();

  await assert.rejects(() => executeGeneration({ jobId: "job-3", ownerId: "user-1", url: "https://example.com", siteType: "blog" }, {
    jobs, sites, publicUrl: "https://mcp.test",
    crawl: async () => crawlResult,
    sniff: async () => records,
    classify: () => ({ strategy: "browser-automation" }),
    synthesize: async () => { throw new Error("synthesis boom"); }
  }));

  const failed = await jobs.get("job-3", "user-1");
  assert.equal(failed?.status, "failed");
  assert.ok(failed?.checkpoint?.crawl, "crawl checkpoint should survive a later-stage failure");

  let crawlCalls = 0;
  await executeGeneration({ jobId: "job-3", ownerId: "user-1", url: "https://example.com", siteType: "blog" }, {
    jobs, sites, publicUrl: "https://mcp.test",
    crawl: async () => { crawlCalls += 1; return crawlResult; },
    sniff: async () => records,
    classify: () => ({ strategy: "browser-automation" }),
    synthesize: async () => spec
  });
  assert.equal(crawlCalls, 0, "retry should resume from the preserved checkpoint instead of re-crawling");
});

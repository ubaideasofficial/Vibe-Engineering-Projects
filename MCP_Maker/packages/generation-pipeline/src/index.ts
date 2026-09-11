import { nanoid } from "nanoid";
import { crawlSite, type CrawlResult } from "@mcp-forge/crawler";
import { sniffNetwork, type NetworkRecord } from "@mcp-forge/network-sniffer";
import { classifyEndpoints, type Classification } from "@mcp-forge/endpoint-classifier";
import { synthesizeCapabilities } from "@mcp-forge/capability-synth";
import { capabilitySpecSchema, type Job, type JobEvent, type JobPhase } from "@mcp-forge/core";
import type { JobRepository, SiteRepository } from "@mcp-forge/storage";

export type GenerationInput = { jobId: string; ownerId: string; url: string; siteType: Job["siteType"] };

export type PipelineOptions = {
  jobs: JobRepository;
  sites: SiteRepository;
  publicUrl: string;
  crawl?: typeof crawlSite;
  sniff?: typeof sniffNetwork;
  classify?: typeof classifyEndpoints;
  synthesize?: typeof synthesizeCapabilities;
};

type Checkpoint = { crawl?: CrawlResult; records?: NetworkRecord[] };

function addEvent(job: Job, phase: JobPhase, message: string): void {
  const event: JobEvent = { phase, message, timestamp: new Date().toISOString() };
  job.events.push(event);
}

export async function executeGeneration(input: GenerationInput, options: PipelineOptions): Promise<void> {
  const crawlFn = options.crawl ?? crawlSite;
  const sniffFn = options.sniff ?? sniffNetwork;
  const classifyFn = options.classify ?? classifyEndpoints;
  const synthesizeFn = options.synthesize ?? synthesizeCapabilities;

  const existing = await options.jobs.get(input.jobId, input.ownerId);
  const job: Job = existing ?? { id: input.jobId, ownerId: input.ownerId, url: input.url, siteType: input.siteType, status: "running", events: [], createdAt: new Date().toISOString() };
  const checkpoint: Checkpoint = (job.checkpoint as Checkpoint | undefined) ?? {};
  const siteId = job.result?.siteId ?? nanoid(10).toLowerCase();
  try {
    let crawl: CrawlResult;
    if (checkpoint.crawl) {
      crawl = checkpoint.crawl;
      addEvent(job, "crawling", "Resuming from a previously completed crawl");
    } else {
      addEvent(job, "crawling", "Fetching robots.txt, sitemap, and public links");
      await options.jobs.save(job);
      crawl = await crawlFn(job.url);
      checkpoint.crawl = crawl;
      job.checkpoint = checkpoint;
    }
    await options.jobs.save(job);

    let records: NetworkRecord[];
    if (checkpoint.records) {
      records = checkpoint.records;
      addEvent(job, "sniffing", "Resuming from previously captured network traffic");
    } else {
      addEvent(job, "sniffing", "Recording JSON XHR/fetch traffic with Playwright");
      await options.jobs.save(job);
      records = [];
      try {
        records = await sniffFn(job.url, crawl.searchPage ?? job.url, crawl.detailPages[0]);
        checkpoint.records = records;
        job.checkpoint = checkpoint;
      } catch (error) {
        addEvent(job, "sniffing", `Browser discovery unavailable; using HTML fallback (${String(error)})`);
      }
    }
    await options.jobs.save(job);

    addEvent(job, "classifying", `Classifying ${records.length} JSON network responses`);
    await options.jobs.save(job);
    const classification: Classification = classifyFn(records);
    addEvent(job, "synthesizing", process.env.OPEN_ROUTER_API_KEY ? "Synthesizing capabilities with OpenRouter" : "Synthesizing validated local fallback capabilities");
    await options.jobs.save(job);
    const spec = capabilitySpecSchema.parse(await synthesizeFn({ crawl, classification, records }));
    const now = new Date().toISOString();
    await options.sites.save({ siteId, ownerId: input.ownerId, spec, disallowedPaths: crawl.disallowedPaths, createdAt: now, updatedAt: now });
    job.status = "ready";
    job.result = { siteId, mcpUrl: `${options.publicUrl}/mcp/${siteId}` };
    job.checkpoint = undefined;
    addEvent(job, "ready", "Generated MCP tools and persisted the site spec");
    await options.jobs.save(job);
  } catch (error) {
    job.status = "failed";
    job.error = error instanceof Error ? error.message : String(error);
    addEvent(job, "failed", job.error);
    await options.jobs.save(job);
    throw error;
  }
}
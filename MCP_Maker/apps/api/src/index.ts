import "dotenv/config";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import cors from "cors";
import express from "express";
import { nanoid } from "nanoid";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { crawlSite, type CrawlResult } from "@mcp-forge/crawler";
import { sniffNetwork, type NetworkRecord } from "@mcp-forge/network-sniffer";
import { classifyEndpoints } from "@mcp-forge/endpoint-classifier";
import { synthesizeCapabilities } from "@mcp-forge/capability-synth";
import { createGeneratedServer } from "@mcp-forge/mcp-codegen";
import { generateRequestSchema, capabilitySpecSchema, type CapabilitySpec, type Job, type JobEvent, type JobPhase } from "@mcp-forge/core";

const app = express();
const jobs = new Map<string, Job>();
const port = Number(process.env.API_PORT ?? 4000);
const dataDirectory = join(process.cwd(), "data");
const sitesFile = join(dataDirectory, "sites.json");
const sites = new Map<string, { spec: CapabilitySpec; disallowedPaths: string[] }>();

app.use(cors({ origin: process.env.WEB_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json());

async function loadSites(): Promise<void> {
  await mkdir(dataDirectory, { recursive: true });
  try {
    const saved = JSON.parse(await readFile(sitesFile, "utf8")) as Record<string, { spec: CapabilitySpec; disallowedPaths: string[] }>;
    for (const [siteId, site] of Object.entries(saved)) sites.set(siteId, site);
  } catch { await writeFile(sitesFile, "{}", "utf8"); }
}

async function saveSite(siteId: string, spec: CapabilitySpec, disallowedPaths: string[]): Promise<void> {
  sites.set(siteId, { spec, disallowedPaths });
  await writeFile(sitesFile, JSON.stringify(Object.fromEntries(sites), null, 2), "utf8");
}

function addEvent(job: Job, phase: JobPhase, message: string): void {
  const event: JobEvent = { phase, message, timestamp: new Date().toISOString() };
  job.events.push(event);
}

async function runPipeline(job: Job): Promise<void> {
  const siteId = nanoid(10).toLowerCase();
  try {
    addEvent(job, "crawling", "Fetching robots.txt, sitemap, and public links");
    const crawl: CrawlResult = await crawlSite(job.url);
    addEvent(job, "sniffing", "Recording JSON XHR/fetch traffic with Playwright");
    let records: NetworkRecord[] = [];
    try { records = await sniffNetwork(job.url, crawl.searchPage ?? job.url); } catch (error) { addEvent(job, "sniffing", `Browser discovery unavailable; using HTML fallback (${String(error)})`); }
    addEvent(job, "classifying", `Classifying ${records.length} JSON network responses`);
    const classification = classifyEndpoints(records);
    addEvent(job, "synthesizing", process.env.OPEN_ROUTER_API_KEY ? "Synthesizing capabilities with OpenRouter" : "Synthesizing validated local fallback capabilities");
    const spec = capabilitySpecSchema.parse(await synthesizeCapabilities({ crawl, classification, records }));
    await saveSite(siteId, spec, crawl.disallowedPaths);
    job.status = "ready";
    job.result = { siteId, mcpUrl: `${process.env.MCP_PUBLIC_URL ?? `http://localhost:${port}`}/mcp/${siteId}` };
    addEvent(job, "ready", "Generated MCP tools and persisted the site spec");
  } catch (error) {
    job.status = "failed";
    job.error = error instanceof Error ? error.message : String(error);
    addEvent(job, "failed", job.error);
  }
}

app.get("/health", (_request, response) => {
  response.json({ ok: true, service: "mcp-forge-api" });
});

app.post("/mcp/:siteId", async (request, response) => {
  const site = sites.get(request.params.siteId);
  if (!site) { response.status(404).json({ error: "Generated site not found" }); return; }
  const server = createGeneratedServer(site.spec, site.disallowedPaths);
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

  response.on("close", () => {
    void transport.close();
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(request, response, request.body);
  } catch (error) {
    console.error("MCP request failed", error);
    if (!response.headersSent) response.status(500).json({ error: "MCP request failed" });
  }
});

app.post("/api/generate", (request, response) => {
  const parsed = generateRequestSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: "Provide a valid URL and supported site type" });
    return;
  }

  const job: Job = {
    id: nanoid(12),
    url: parsed.data.url,
    siteType: parsed.data.siteType,
    status: "running",
    events: []
  };
  addEvent(job, "queued", "Generation job accepted");
  jobs.set(job.id, job);
  void runPipeline(job);
  response.status(202).json({ jobId: job.id });
});

app.get("/api/status/:jobId", (request, response) => {
  const job = jobs.get(request.params.jobId);
  if (!job) {
    response.status(404).json({ error: "Job not found" });
    return;
  }

  response.json(job);
});

app.get("/api/status/:jobId/stream", (request, response) => {
  const job = jobs.get(request.params.jobId);
  if (!job) {
    response.status(404).end();
    return;
  }

  response.setHeader("Content-Type", "text/event-stream");
  response.setHeader("Cache-Control", "no-cache");
  response.setHeader("Connection", "keep-alive");
  response.flushHeaders();

  let sent = 0;
  const send = (): void => {
    const events = job.events.slice(sent);
    events.forEach((event) => response.write(`data: ${JSON.stringify(event)}\n\n`));
    sent = job.events.length;
    if (job.status !== "running") {
      response.write(`event: complete\ndata: ${JSON.stringify(job)}\n\n`);
      response.end();
      clearInterval(timer);
    }
  };
  const timer = setInterval(send, 250);
  send();
  request.on("close", () => clearInterval(timer));
});

await loadSites();
app.listen(port, () => console.log(`MCP Forge API listening on http://localhost:${port}`));
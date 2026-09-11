import { join } from "node:path";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { nanoid } from "nanoid";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createGeneratedServer } from "@mcp-forge/mcp-codegen";
import { generateRequestSchema, type Job, type JobEvent, type JobPhase } from "@mcp-forge/core";
import { createJobRepository, createSiteRepository, type JobRepository, type SiteRepository } from "@mcp-forge/storage";
import { BullMqGenerationQueue, LocalGenerationQueue, type GenerationQueue } from "@mcp-forge/job-queue";
import { executeGeneration } from "@mcp-forge/generation-pipeline";

dotenv.config({ path: join(process.cwd(), "../../.env"), override: true });

const app = express();
const port = Number(process.env.API_PORT ?? 4000);
const ownerId = process.env.MCP_OWNER_ID ?? "local";
const localDataRoot = process.env.MCP_DATA_FILE ?? join(process.cwd(), "../../data/sites.json");
const siteRepository: SiteRepository = createSiteRepository({
  mode: process.env.STORAGE_MODE,
  localFile: localDataRoot,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
});
const jobRepository: JobRepository = createJobRepository({
  mode: process.env.STORAGE_MODE,
  localFile: localDataRoot.replace(/sites\.json$/, "jobs.json"),
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
});

app.use(cors({ origin: process.env.WEB_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json());

async function persistJob(job: Job): Promise<void> {
  await jobRepository.save(job);
}

function hydrateJobResult(job: Job): Job {
  if (job.result && !job.result.mcpUrl) {
    return { ...job, result: { ...job.result, mcpUrl: `${process.env.MCP_PUBLIC_URL ?? `http://localhost:${port}`}/mcp/${job.result.siteId}` } };
  }
  return job;
}

function addEvent(job: Job, phase: JobPhase, message: string): void {
  job.events.push({ phase, message, timestamp: new Date().toISOString() });
}

const generationQueue: GenerationQueue = process.env.QUEUE_MODE === "redis" && process.env.REDIS_URL
  ? new BullMqGenerationQueue({
      host: new URL(process.env.REDIS_URL).hostname,
      port: Number(new URL(process.env.REDIS_URL).port || 6379),
      username: new URL(process.env.REDIS_URL).username || undefined,
      password: new URL(process.env.REDIS_URL).password || undefined,
      tls: new URL(process.env.REDIS_URL).protocol === "rediss:" ? {} : undefined,
      maxRetriesPerRequest: null
    })
  : new LocalGenerationQueue(async ({ jobId, ownerId: queuedOwner }) => {
      await executeGeneration({ jobId, ownerId: queuedOwner, url: (await jobRepository.get(jobId, queuedOwner))?.url ?? "", siteType: (await jobRepository.get(jobId, queuedOwner))?.siteType ?? "blog" }, { jobs: jobRepository, sites: siteRepository, publicUrl: process.env.MCP_PUBLIC_URL ?? `http://localhost:${port}` });
    });

app.get("/health", (_request, response) => {
  response.json({ ok: true, service: "mcp-forge-api" });
});

app.post("/mcp/:siteId", async (request, response) => {
  const site = await siteRepository.get(request.params.siteId, ownerId);
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

app.post("/api/generate", async (request, response) => {
  try {
    const parsed = generateRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      response.status(400).json({ error: "Provide a valid URL and supported site type" });
      return;
    }

    const job: Job = {
      id: nanoid(12),
      ownerId,
      url: parsed.data.url,
      siteType: parsed.data.siteType,
      status: "running",
      events: []
    };
    addEvent(job, "queued", "Generation job accepted");
    await persistJob(job);
    await generationQueue.add({ jobId: job.id, ownerId, url: job.url, siteType: job.siteType });
    response.status(202).json({ jobId: job.id });
  } catch (error) {
    console.error("Generation request failed", error);
    response.status(503).json({ error: "Generation storage or queue is unavailable" });
  }
});

app.get("/api/status/:jobId", async (request, response) => {
  const job = await jobRepository.get(request.params.jobId, ownerId);
  if (!job) {
    response.status(404).json({ error: "Job not found" });
    return;
  }

  response.json(hydrateJobResult(job));
});

app.get("/api/status/:jobId/stream", async (request, response) => {
  const initialJob = await jobRepository.get(request.params.jobId, ownerId);
  if (!initialJob) {
    response.status(404).end();
    return;
  }

  response.setHeader("Content-Type", "text/event-stream");
  response.setHeader("Cache-Control", "no-cache");
  response.setHeader("Connection", "keep-alive");
  response.flushHeaders();

  let sent = 0;
  const send = async (): Promise<void> => {
    const storedJob = await jobRepository.get(request.params.jobId, ownerId);
    const job = storedJob ? hydrateJobResult(storedJob) : undefined;
    if (!job) return;
    const events = job.events.slice(sent);
    events.forEach((event: JobEvent) => response.write(`data: ${JSON.stringify(event)}\n\n`));
    sent = job.events.length;
    if (job.status !== "running") {
      response.write(`event: complete\ndata: ${JSON.stringify(job)}\n\n`);
      response.end();
      clearInterval(timer);
    }
  };
  const timer = setInterval(() => { void send(); }, 250);
  void send();
  request.on("close", () => clearInterval(timer));
});

await siteRepository.load();
await jobRepository.load();
app.listen(port, () => console.log(`MCP Forge API listening on http://localhost:${port}`));
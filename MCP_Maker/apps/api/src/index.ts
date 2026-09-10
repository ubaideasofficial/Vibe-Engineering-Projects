import cors from "cors";
import express from "express";
import { nanoid } from "nanoid";
import { generateRequestSchema, type Job, type JobEvent, type JobPhase } from "@mcp-forge/core";

const app = express();
const jobs = new Map<string, Job>();
const port = Number(process.env.API_PORT ?? 4000);

app.use(cors());
app.use(express.json());

function addEvent(job: Job, phase: JobPhase, message: string): void {
  const event: JobEvent = { phase, message, timestamp: new Date().toISOString() };
  job.events.push(event);
}

function runLocalPipeline(job: Job): void {
  const steps: Array<[JobPhase, string]> = [
    ["crawling", "Reading robots.txt and discovering candidate pages"],
    ["sniffing", "Preparing network discovery for the listing page"],
    ["classifying", "Classifying discovered endpoints"],
    ["synthesizing", "Building the two-tool capability specification"]
  ];

  steps.forEach(([phase, message], index) => {
    setTimeout(() => {
      if (job.status !== "running") return;
      addEvent(job, phase, message);
      if (index === steps.length - 1) {
        const siteId = nanoid(10).toLowerCase();
        job.status = "ready";
        job.result = { siteId, mcpUrl: `http://localhost:4000/mcp/${siteId}` };
        addEvent(job, "ready", "Local MCP endpoint is ready");
      }
    }, (index + 1) * 700);
  });
}

app.get("/health", (_request, response) => {
  response.json({ ok: true, service: "mcp-forge-api" });
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
  runLocalPipeline(job);
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

app.listen(port, () => {
  console.log(`MCP Forge API listening on http://localhost:${port}`);
});
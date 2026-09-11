import { join } from "node:path";
import dotenv from "dotenv";
import { createGenerationWorker, createRedisConnection, unwrapBullJob } from "@mcp-forge/job-queue";
import { createJobRepository, createSiteRepository } from "@mcp-forge/storage";
import { executeGeneration } from "@mcp-forge/generation-pipeline";

dotenv.config({ path: join(process.cwd(), "../../.env"), override: true });

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  console.error("REDIS_URL is required to start the durable worker");
  process.exit(1);
}

const ownerId = process.env.MCP_OWNER_ID ?? "local";
const dataFile = process.env.MCP_DATA_FILE ?? join(process.cwd(), "../../data/sites.json");
const sites = createSiteRepository({ mode: process.env.STORAGE_MODE, localFile: dataFile, supabaseUrl: process.env.SUPABASE_URL, supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY });
const jobs = createJobRepository({ mode: process.env.STORAGE_MODE, localFile: dataFile.replace(/sites\.json$/, "jobs.json"), supabaseUrl: process.env.SUPABASE_URL, supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY });
await sites.load();
await jobs.load();

const worker = createGenerationWorker(createRedisConnection(redisUrl), async (job) => {
  const input = unwrapBullJob(job);
  await executeGeneration(input, { jobs, sites, publicUrl: process.env.MCP_PUBLIC_URL ?? "http://localhost:4000" });
});

worker.on("completed", (job) => console.log(JSON.stringify({ event: "generation_job_completed", jobId: job.data.jobId })));
worker.on("failed", (job, error) => console.error(JSON.stringify({ event: "generation_job_failed", jobId: job?.data.jobId, error: error.message })));
console.log("MCP Forge durable worker listening");
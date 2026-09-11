import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { LocalJobRepository, checkGenerationQuota } from "../src/index.js";

async function withRepo(run: (repo: LocalJobRepository) => Promise<void>): Promise<void> {
  const directory = await mkdtemp(join(tmpdir(), "mcp-forge-quota-"));
  const repo = new LocalJobRepository(join(directory, "jobs.json"));
  await repo.load();
  try { await run(repo); } finally { await rm(directory, { recursive: true, force: true }); }
}

test("quota allows generation when the owner is under both limits", () => withRepo(async (repo) => {
  await repo.save({ id: "job-1", ownerId: "user-1", url: "https://example.com", siteType: "blog", status: "ready", events: [], createdAt: new Date().toISOString() });
  const result = await checkGenerationQuota(repo, "user-1", { maxConcurrentJobs: 2, maxJobsPerDay: 20 });
  assert.equal(result.allowed, true);
}));

test("quota blocks a new job once the owner hits the concurrent-jobs limit", () => withRepo(async (repo) => {
  await repo.save({ id: "job-1", ownerId: "user-1", url: "https://example.com", siteType: "blog", status: "running", events: [], createdAt: new Date().toISOString() });
  await repo.save({ id: "job-2", ownerId: "user-1", url: "https://example.com", siteType: "blog", status: "running", events: [], createdAt: new Date().toISOString() });
  const result = await checkGenerationQuota(repo, "user-1", { maxConcurrentJobs: 2, maxJobsPerDay: 20 });
  assert.equal(result.allowed, false);
}));

test("quota blocks a new job once the owner hits the daily-jobs limit", () => withRepo(async (repo) => {
  for (let index = 0; index < 3; index += 1) {
    await repo.save({ id: `job-${index}`, ownerId: "user-1", url: "https://example.com", siteType: "blog", status: "ready", events: [], createdAt: new Date().toISOString() });
  }
  const result = await checkGenerationQuota(repo, "user-1", { maxConcurrentJobs: 5, maxJobsPerDay: 3 });
  assert.equal(result.allowed, false);
}));

test("quota ignores jobs older than 24 hours for the daily limit", () => withRepo(async (repo) => {
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  await repo.save({ id: "job-old", ownerId: "user-1", url: "https://example.com", siteType: "blog", status: "ready", events: [], createdAt: twoDaysAgo });
  const result = await checkGenerationQuota(repo, "user-1", { maxConcurrentJobs: 2, maxJobsPerDay: 1 });
  assert.equal(result.allowed, true);
}));

test("quota is scoped per owner", () => withRepo(async (repo) => {
  await repo.save({ id: "job-1", ownerId: "user-1", url: "https://example.com", siteType: "blog", status: "running", events: [], createdAt: new Date().toISOString() });
  const result = await checkGenerationQuota(repo, "user-2", { maxConcurrentJobs: 1, maxJobsPerDay: 20 });
  assert.equal(result.allowed, true);
}));

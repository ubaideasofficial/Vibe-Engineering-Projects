import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createHash, randomBytes } from "node:crypto";
import type { CapabilitySpec } from "@mcp-forge/core";
import type { Job } from "@mcp-forge/core";

export type StoredSite = {
  siteId: string;
  ownerId: string;
  spec: CapabilitySpec;
  disallowedPaths: string[];
  createdAt: string;
  updatedAt: string;
};

export interface SiteRepository {
  load(): Promise<void>;
  get(siteId: string, ownerId?: string): Promise<StoredSite | undefined>;
  save(site: StoredSite): Promise<void>;
}

export class LocalSiteRepository implements SiteRepository {
  private readonly sites = new Map<string, StoredSite>();

  constructor(private readonly filePath: string) {}

  async load(): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    try {
      const raw = JSON.parse(await readFile(this.filePath, "utf8")) as Record<string, StoredSite>;
      Object.entries(raw).forEach(([siteId, site]) => this.sites.set(siteId, site));
    } catch {
      await writeFile(this.filePath, "{}", "utf8");
    }
  }

  async get(siteId: string, ownerId = "local"): Promise<StoredSite | undefined> {
    const site = this.sites.get(siteId);
    return site?.ownerId === ownerId ? site : undefined;
  }

  async save(site: StoredSite): Promise<void> {
    this.sites.set(site.siteId, site);
    await writeFile(this.filePath, JSON.stringify(Object.fromEntries(this.sites), null, 2), "utf8");
  }
}

export class SupabaseSiteRepository implements SiteRepository {
  private readonly client: SupabaseClient;

  constructor(url: string, serviceRoleKey: string) {
    this.client = createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  }

  async load(): Promise<void> {}

  async get(siteId: string, ownerId: string): Promise<StoredSite | undefined> {
    const { data, error } = await this.client.from("sites").select("site_id, owner_id, disallowed_paths, created_at, updated_at, capability_specs(spec_json)").eq("site_id", siteId).eq("owner_id", ownerId).maybeSingle();
    if (error) throw error;
    if (!data) return undefined;
    const row = data as { site_id: string; owner_id: string; disallowed_paths: string[]; created_at: string; updated_at: string; capability_specs: { spec_json: CapabilitySpec } | { spec_json: CapabilitySpec }[] | null };
    const capability = Array.isArray(row.capability_specs) ? row.capability_specs[0] : row.capability_specs;
    if (!capability) return undefined;
    return { siteId: row.site_id, ownerId: row.owner_id, disallowedPaths: row.disallowed_paths ?? [], spec: capability.spec_json, createdAt: row.created_at, updatedAt: row.updated_at };
  }

  async save(site: StoredSite): Promise<void> {
    const { error: siteError } = await this.client.from("sites").upsert({ site_id: site.siteId, owner_id: site.ownerId, source_url: site.spec.site.url, site_name: site.spec.site.name, status: "ready", disallowed_paths: site.disallowedPaths, updated_at: site.updatedAt }, { onConflict: "site_id" });
    if (siteError) throw siteError;
    const { error: specError } = await this.client.from("capability_specs").upsert({ site_id: site.siteId, spec_json: site.spec, updated_at: site.updatedAt }, { onConflict: "site_id" });
    if (specError) throw specError;
  }
}

export function createSiteRepository(options: { mode?: string; localFile: string; supabaseUrl?: string; supabaseServiceRoleKey?: string }): SiteRepository {
  if (options.mode === "supabase" && options.supabaseUrl && options.supabaseServiceRoleKey) return new SupabaseSiteRepository(options.supabaseUrl, options.supabaseServiceRoleKey);
  return new LocalSiteRepository(options.localFile);
}

export interface JobRepository {
  load(): Promise<void>;
  get(jobId: string, ownerId?: string): Promise<Job | undefined>;
  save(job: Job): Promise<void>;
}

export class LocalJobRepository implements JobRepository {
  private readonly jobs = new Map<string, Job>();

  constructor(private readonly filePath: string) {}

  async load(): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    try {
      const raw = JSON.parse(await readFile(this.filePath, "utf8")) as Record<string, Job>;
      Object.entries(raw).forEach(([jobId, job]) => this.jobs.set(jobId, job));
    } catch {
      await writeFile(this.filePath, "{}", "utf8");
    }
  }

  async get(jobId: string, ownerId = "local"): Promise<Job | undefined> {
    const job = this.jobs.get(jobId);
    return job?.ownerId === ownerId ? job : undefined;
  }

  async save(job: Job): Promise<void> {
    this.jobs.set(job.id, job);
    await writeFile(this.filePath, JSON.stringify(Object.fromEntries(this.jobs), null, 2), "utf8");
  }
}

export class SupabaseJobRepository implements JobRepository {
  private readonly client: SupabaseClient;

  constructor(url: string, serviceRoleKey: string) {
    this.client = createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  }

  async load(): Promise<void> {}

  async get(jobId: string, ownerId: string): Promise<Job | undefined> {
    const { data, error } = await this.client.from("generation_jobs").select("job_id, owner_id, source_url, site_type, status, phase, logs, error, site_id").eq("job_id", jobId).eq("owner_id", ownerId).maybeSingle();
    if (error) throw error;
    if (!data) return undefined;
    const row = data as { job_id: string; owner_id: string; source_url: string; site_type: Job["siteType"]; status: Job["status"]; phase: string; logs: Job["events"]; error?: string; site_id?: string };
    return { id: row.job_id, ownerId: row.owner_id, url: row.source_url, siteType: row.site_type, status: row.status, events: row.logs ?? [], error: row.error, ...(row.site_id ? { result: { siteId: row.site_id, mcpUrl: "" } } : {}) };
  }

  async save(job: Job): Promise<void> {
    const resultSiteId = job.result?.siteId;
    const { error } = await this.client.from("generation_jobs").upsert({ job_id: job.id, owner_id: job.ownerId, source_url: job.url, site_type: job.siteType, status: job.status, phase: job.events.at(-1)?.phase ?? "queued", logs: job.events, error: job.error, site_id: resultSiteId ?? null, updated_at: new Date().toISOString() }, { onConflict: "job_id" });
    if (error) throw error;
  }
}

export function createJobRepository(options: { mode?: string; localFile: string; supabaseUrl?: string; supabaseServiceRoleKey?: string }): JobRepository {
  if (options.mode === "supabase" && options.supabaseUrl && options.supabaseServiceRoleKey) return new SupabaseJobRepository(options.supabaseUrl, options.supabaseServiceRoleKey);
  return new LocalJobRepository(options.localFile);
}

export function createMcpToken(): { token: string; hash: string } {
  const token = `mcp_${randomBytes(32).toString("base64url")}`;
  return { token, hash: hashMcpToken(token) };
}

export function hashMcpToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
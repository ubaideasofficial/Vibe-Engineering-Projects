create table if not exists public.sites (
  site_id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  source_url text not null,
  site_name text not null,
  status text not null check (status in ('queued', 'running', 'ready', 'failed')),
  disallowed_paths jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.capability_specs (
  site_id text primary key references public.sites(site_id) on delete cascade,
  spec_json jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.generation_jobs (
  job_id text primary key,
  owner_id uuid references auth.users(id) on delete cascade,
  site_id text references public.sites(site_id) on delete set null,
  source_url text not null,
  site_type text not null,
  status text not null,
  phase text not null,
  logs jsonb not null default '[]'::jsonb,
  error text,
  retry_count integer not null default 0,
  checkpoint jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mcp_tokens (
  token_id uuid primary key default gen_random_uuid(),
  site_id text not null references public.sites(site_id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.tool_runs (
  run_id uuid primary key default gen_random_uuid(),
  site_id text not null references public.sites(site_id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  tool_name text not null,
  status text not null,
  latency_ms integer,
  target_host text,
  error_code text,
  created_at timestamptz not null default now()
);

alter table public.sites enable row level security;
alter table public.capability_specs enable row level security;
alter table public.generation_jobs enable row level security;
alter table public.mcp_tokens enable row level security;
alter table public.tool_runs enable row level security;

create policy "owners can read sites" on public.sites for select using (auth.uid() = owner_id);
create policy "owners can read capability specs" on public.capability_specs for select using (exists (select 1 from public.sites where sites.site_id = capability_specs.site_id and sites.owner_id = auth.uid()));
create policy "owners can read jobs" on public.generation_jobs for select using (auth.uid() = owner_id);
create policy "owners can read tokens" on public.mcp_tokens for select using (auth.uid() = owner_id);
create policy "owners can read tool runs" on public.tool_runs for select using (auth.uid() = owner_id);
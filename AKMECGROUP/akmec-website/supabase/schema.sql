-- AKMEC Careers module schema
-- Run this once in the Supabase SQL editor (or `supabase db push`) on a fresh project.

-- ── profiles ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  phone text,
  headline text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are editable by owner"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── jobs ────────────────────────────────────────────────────────────────────
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  department text not null,
  location text not null,
  employment_type text not null default 'Full-time',
  experience_level text,
  summary text not null,
  description text not null,
  requirements text[] not null default '{}',
  status text not null default 'open' check (status in ('open', 'closed')),
  posted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.jobs enable row level security;

create policy "Open jobs are publicly readable"
  on public.jobs for select
  using (status = 'open');

-- Writes are intentionally left to the service role (Supabase dashboard / SQL
-- editor) — no client-facing insert/update/delete policy is defined.

-- ── applications ────────────────────────────────────────────────────────────
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.profiles (id) on delete cascade,
  job_id uuid not null references public.jobs (id) on delete cascade,
  cover_note text,
  resume_path text,
  status text not null default 'submitted' check (status in ('submitted', 'reviewing', 'shortlisted', 'rejected', 'hired')),
  created_at timestamptz not null default now(),
  unique (candidate_id, job_id)
);

alter table public.applications enable row level security;

create policy "Candidates view own applications"
  on public.applications for select
  using (auth.uid() = candidate_id);

create policy "Candidates create own applications"
  on public.applications for insert
  with check (auth.uid() = candidate_id);

-- ── storage: resumes bucket ─────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

create policy "Candidates upload own resumes"
  on storage.objects for insert
  with check (
    bucket_id = 'resumes'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Candidates read own resumes"
  on storage.objects for select
  using (
    bucket_id = 'resumes'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ── seed: sample open positions (safe to edit/remove) ──────────────────────
insert into public.jobs (slug, title, department, location, employment_type, experience_level, summary, description, requirements)
values
  (
    'ndt-technician-paut-tofd',
    'NDT Technician — PAUT / TOFD',
    'Examination & Testing',
    'Nashik, Maharashtra',
    'Full-time',
    '3-6 years',
    'Perform advanced ultrasonic examination (PAUT, TOFD) on piping, pressure vessels, and structural welds for industrial clients.',
    'AKMEC is looking for a certified NDT Technician to join our Examination & Testing team. You will carry out Phased Array and TOFD ultrasonic inspections on client sites, prepare inspection reports to relevant codes and standards, and support shutdown/turnaround inspection campaigns.',
    array['ASNT/PCN Level II in PAUT & TOFD', 'Experience with piping and pressure vessel inspection', 'Willingness to travel to client sites', 'Strong report writing skills']
  ),
  (
    'qaqc-inspector-piping',
    'QA/QC Inspector — Piping',
    'Inspection & Audit',
    'Vadodara, Gujarat',
    'Full-time',
    '2-5 years',
    'Conduct quality assurance and quality control inspection of piping fabrication and installation for EPC projects.',
    'As a QA/QC Inspector you will monitor piping fabrication, welding, and installation activities against approved drawings and specifications, witness NDT and hydro-testing, and maintain inspection documentation for client and regulatory review.',
    array['Diploma/Degree in Mechanical Engineering', 'Working knowledge of ASME B31.3', 'CSWIP or equivalent QC certification preferred', 'Experience on EPC or refinery projects']
  ),
  (
    'asset-integrity-engineer',
    'Asset Integrity Engineer',
    'Asset Integrity & Technical Solutions',
    'Mumbai, Maharashtra',
    'Full-time',
    '5-8 years',
    'Support RBI studies, fitness-for-service assessments, and corrosion loop analysis for client asset integrity programs.',
    'Join our Asset Integrity team to deliver Risk Based Inspection studies, Fitness for Service assessments (API 579), corrosion loop development, and remaining life calculations for process plant assets.',
    array['Bachelor''s in Mechanical/Chemical Engineering', 'Experience with RBI and FFS methodologies', 'Familiarity with API 510/570/580/653', 'Strong analytical and reporting skills']
  )
on conflict (slug) do nothing;

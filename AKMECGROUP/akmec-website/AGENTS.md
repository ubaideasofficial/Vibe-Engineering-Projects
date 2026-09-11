<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Careers module (Supabase-backed)

Adds a public Careers section with candidate signup/login and job applications, backed by Supabase (Postgres + Auth + Storage).

## Data model (`supabase/schema.sql`)
- `profiles` — one row per authenticated candidate (mirrors `auth.users`), created via trigger on signup. Holds name/phone/headline.
- `jobs` — job openings managed in Supabase (title, department, location, employment type, description, requirements, status). Publicly readable when `status = 'open'`; writable only by service role (admin edits happen in the Supabase dashboard/SQL editor, not the app).
- `applications` — one row per candidate application to a job (candidate_id, job_id, cover_note, resume_path, status). RLS: a candidate can only see/insert their own rows.
- Storage bucket `resumes` — private; candidates can upload/read only their own files (`{user_id}/...` path prefix enforced by policy). No public URLs; admins read via signed URLs from the Supabase dashboard.

Run `supabase/schema.sql` once in the Supabase SQL editor on a fresh project before using the feature.

## Auth
- `@supabase/ssr` for cookie-based sessions across server/client components, `@supabase/supabase-js` for the typed client.
- `lib/supabase/client.ts` — browser client (client components).
- `lib/supabase/server.ts` — server client (server components, route handlers) using `next/headers` cookies.
- `middleware.ts` — refreshes the Supabase session on every request and gates `/careers/dashboard` behind auth (redirects to `/careers/login`).
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `.env.example`). No service-role key is used client-side or in the app runtime.

## Routes
- `/careers` — public job listings pulled from `jobs` (open positions only), styled to match the existing neumorphic/glass design system.
- `/careers/[slug]` — job detail + "Apply" (redirects to login if unauthenticated).
- `/careers/signup`, `/careers/login` — candidate auth forms (email + password via Supabase Auth).
- `/careers/dashboard` — authenticated candidate view: profile + list of their applications and status.
- `/careers/apply/[slug]` — authenticated application form (cover note + resume PDF upload to the `resumes` bucket).
- `/auth/callback` — route handler that exchanges the Supabase auth code for a session (email confirmation / magic-link redirect target).

## Conventions to keep
- Match existing visual language: `GlassPanel`/`ClayCard` effects, `--color-steel-*` / `--color-safety` tokens, `font-display` uppercase headings, react-hook-form + zod for all forms, honeypot field on public forms.
- Keep job content editing server-side in Supabase (no admin UI in this app yet) — do not hardcode job listings in the codebase.

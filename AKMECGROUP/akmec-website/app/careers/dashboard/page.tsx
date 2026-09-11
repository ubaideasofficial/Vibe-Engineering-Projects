import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
import { isSupabaseConfigured } from '../../../lib/supabase/config';
import { GlassPanel } from '../../../components/effects/GlassPanel';
import { SignOutButton } from '../../../components/careers/SignOutButton';
import { SetupNotice } from '../../../components/careers/SetupNotice';
import type { Application, Profile } from '../../../lib/supabase/types';

export const metadata = { title: 'My Dashboard | Careers at AKMEC LLP' };

const STATUS_STYLES: Record<string, string> = {
  submitted: 'bg-white/10 text-[var(--color-steel-100)]',
  reviewing: 'bg-[var(--color-warn)]/20 text-[var(--color-warn)]',
  shortlisted: 'bg-[var(--color-signal)]/20 text-[var(--color-signal)]',
  hired: 'bg-green-500/20 text-green-400',
  rejected: 'bg-[var(--color-danger)]/20 text-[var(--color-danger)]',
};

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="pt-24 bg-[var(--color-steel-950)] min-h-screen pb-24 flex items-center">
        <SetupNotice />
      </div>
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/careers/login?redirectedFrom=/careers/dashboard');
  }

  const [{ data: profile }, { data: applications }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('applications')
      .select('*, jobs(title, slug, department, location)')
      .eq('candidate_id', user.id)
      .order('created_at', { ascending: false }),
  ]);

  const typedProfile = profile as Profile | null;
  const typedApplications = (applications ?? []) as Application[];

  return (
    <div className="pt-24 bg-[var(--color-steel-950)] min-h-screen pb-24 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-safety)]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              Welcome{typedProfile?.full_name ? `, ${typedProfile.full_name}` : ''}
            </h1>
            <p className="text-[var(--color-steel-300)]">{user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/careers" className="text-sm font-bold text-[var(--color-steel-100)] hover:text-[var(--color-safety)] transition-colors">
              Browse Open Positions
            </Link>
            <SignOutButton />
          </div>
        </div>

        <GlassPanel dark={true} className="p-8 md:p-10">
          <h2 className="text-xl font-display font-bold text-white mb-6">My Applications</h2>

          {typedApplications.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[var(--color-steel-300)] mb-6">You haven&apos;t applied to any positions yet.</p>
              <Link
                href="/careers"
                className="inline-flex items-center justify-center px-6 py-3 bg-[var(--color-safety)] hover:bg-orange-600 text-white font-bold rounded-xl transition-colors"
              >
                Explore Open Positions
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {typedApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-[var(--color-steel-900)] border border-white/10 rounded-xl px-6 py-5"
                >
                  <div>
                    <Link
                      href={app.jobs ? `/careers/${app.jobs.slug}` : '/careers'}
                      className="text-white font-bold hover:text-[var(--color-safety)] transition-colors"
                    >
                      {app.jobs?.title ?? 'Position no longer listed'}
                    </Link>
                    <p className="text-[var(--color-steel-300)] text-sm mt-1">
                      {app.jobs?.department} {app.jobs?.location && `· ${app.jobs.location}`}
                    </p>
                    <p className="text-[var(--color-steel-300)] text-xs mt-1">
                      Applied {new Date(app.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center self-start md:self-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${STATUS_STYLES[app.status] ?? STATUS_STYLES.submitted}`}
                  >
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      </div>
    </div>
  );
}

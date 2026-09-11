import React from 'react';
import { createClient } from '../../lib/supabase/server';
import { isSupabaseConfigured } from '../../lib/supabase/config';
import { JobCard } from '../../components/careers/JobCard';
import { AuthNav } from '../../components/careers/AuthNav';
import { SetupNotice } from '../../components/careers/SetupNotice';
import type { Job } from '../../lib/supabase/types';

export const metadata = {
  title: 'Careers | AKMEC LLP',
  description: 'Join AKMEC LLP — explore open positions in Inspection, NDT, Asset Integrity, and Technical Solutions across our global offices.',
};

export const revalidate = 60;

export default async function CareersPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="pt-24 bg-[var(--color-steel-950)] min-h-screen pb-24 flex items-center">
        <SetupNotice />
      </div>
    );
  }

  const supabase = await createClient();

  const [{ data: jobs, error }, { data: { user } }] = await Promise.all([
    supabase.from('jobs').select('*').eq('status', 'open').order('posted_at', { ascending: false }),
    supabase.auth.getUser(),
  ]);

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    isAdmin = Boolean(profile?.is_admin);
  }

  return (
    <div className="pt-24 bg-[var(--color-steel-050)] min-h-screen">
      {/* Hero */}
      <section className="bg-[var(--color-steel-950)] py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-safety)]/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-signal)]/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="text-center md:text-left max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">Build Your Career at AKMEC</h1>
              <p className="text-xl text-[var(--color-steel-300)]">
                Join a team of inspection, testing, and asset integrity professionals delivering quality across the globe.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <AuthNav isAuthenticated={!!user} isAdmin={isAdmin} />
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16 -mt-10 relative z-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm font-medium mb-8" role="alert">
              Unable to load open positions right now. Please try again shortly.
            </div>
          )}

          {!error && (!jobs || jobs.length === 0) && (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-[var(--color-steel-800)] mb-2">No Open Positions Right Now</h3>
              <p className="text-[var(--color-steel-600)]">Check back soon, or send your CV to inquiry@akmecgroup.com.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(jobs as Job[] | null)?.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

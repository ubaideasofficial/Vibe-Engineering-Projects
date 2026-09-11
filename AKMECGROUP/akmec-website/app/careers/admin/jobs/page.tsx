import React from 'react';
import Link from 'next/link';
import { createClient } from '../../../../lib/supabase/server';
import { isSupabaseConfigured } from '../../../../lib/supabase/config';
import { requireAdminUser } from '../../../../lib/supabase/admin';
import { GlassPanel } from '../../../../components/effects/GlassPanel';
import { DeleteJobButton } from '../../../../components/careers/admin/DeleteJobButton';
import { SetupNotice } from '../../../../components/careers/SetupNotice';
import type { Job } from '../../../../lib/supabase/types';

export const metadata = { title: 'Manage Jobs | Careers Admin' };

export default async function AdminJobsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="pt-24 bg-[var(--color-steel-950)] min-h-screen pb-24 flex items-center">
        <SetupNotice />
      </div>
    );
  }

  const supabase = await createClient();
  await requireAdminUser(supabase);

  const { data: jobs } = await supabase.from('jobs').select('*').order('posted_at', { ascending: false });

  return (
    <div className="pt-24 bg-[var(--color-steel-950)] min-h-screen pb-24 relative">
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <Link href="/careers/admin" className="text-sm text-[var(--color-steel-300)] hover:text-white transition-colors">
              ← Admin
            </Link>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mt-2">Manage Jobs</h1>
          </div>
          <Link
            href="/careers/admin/jobs/new"
            className="inline-flex items-center justify-center px-6 py-3 bg-[var(--color-safety)] hover:bg-orange-600 text-white font-bold rounded-xl transition-colors"
          >
            + Post New Job
          </Link>
        </div>

        <div className="space-y-4">
          {((jobs ?? []) as Job[]).map((job) => (
            <GlassPanel key={job.id} dark={true} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-white font-bold">{job.title}</h2>
                  <span
                    className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                      job.status === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-[var(--color-steel-300)]'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <p className="text-[var(--color-steel-300)] text-sm mt-1">
                  {job.department} · {job.location}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/careers/admin/jobs/${job.id}/edit`}
                  className="text-sm font-bold text-[var(--color-safety)] hover:text-orange-400 transition-colors"
                >
                  Edit
                </Link>
                <DeleteJobButton id={job.id} title={job.title} />
              </div>
            </GlassPanel>
          ))}
          {(!jobs || jobs.length === 0) && (
            <p className="text-[var(--color-steel-300)] text-center py-10">No jobs yet. Post your first opening.</p>
          )}
        </div>
      </div>
    </div>
  );
}

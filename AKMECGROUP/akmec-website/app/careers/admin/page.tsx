import React from 'react';
import Link from 'next/link';
import { createClient } from '../../../lib/supabase/server';
import { isSupabaseConfigured } from '../../../lib/supabase/config';
import { requireAdminUser } from '../../../lib/supabase/admin';
import { GlassPanel } from '../../../components/effects/GlassPanel';
import { SignOutButton } from '../../../components/careers/SignOutButton';
import { SetupNotice } from '../../../components/careers/SetupNotice';

export const metadata = { title: 'Admin | Careers at AKMEC LLP' };

export default async function AdminPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="pt-24 bg-[var(--color-steel-950)] min-h-screen pb-24 flex items-center">
        <SetupNotice />
      </div>
    );
  }

  const supabase = await createClient();
  await requireAdminUser(supabase);

  const [{ count: openJobs }, { count: totalJobs }, { count: totalApplications }, { count: newApplications }] = await Promise.all([
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('jobs').select('*', { count: 'exact', head: true }),
    supabase.from('applications').select('*', { count: 'exact', head: true }),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'submitted'),
  ]);

  return (
    <div className="pt-24 bg-[var(--color-steel-950)] min-h-screen pb-24 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-safety)]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white">Careers Admin</h1>
          <div className="flex items-center gap-4">
            <Link href="/careers" className="text-sm font-bold text-[var(--color-steel-100)] hover:text-[var(--color-safety)] transition-colors">
              View Public Page
            </Link>
            <SignOutButton />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Open Jobs" value={openJobs ?? 0} />
          <StatCard label="Total Jobs" value={totalJobs ?? 0} />
          <StatCard label="Applications" value={totalApplications ?? 0} />
          <StatCard label="New" value={newApplications ?? 0} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/careers/admin/jobs">
            <GlassPanel dark={true} className="p-8 border border-transparent hover:border-[var(--color-safety)] transition-colors">
              <h2 className="text-xl font-display font-bold text-white mb-2">Manage Jobs</h2>
              <p className="text-[var(--color-steel-300)] text-sm">Post new openings, edit details, or close positions.</p>
            </GlassPanel>
          </Link>
          <Link href="/careers/admin/applications">
            <GlassPanel dark={true} className="p-8 border border-transparent hover:border-[var(--color-safety)] transition-colors">
              <h2 className="text-xl font-display font-bold text-white mb-2">Review Applications</h2>
              <p className="text-[var(--color-steel-300)] text-sm">View candidates, download resumes, and update status.</p>
            </GlassPanel>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <GlassPanel dark={true} className="p-5 text-center">
      <div className="text-3xl font-display font-bold text-white">{value}</div>
      <div className="text-xs text-[var(--color-steel-300)] uppercase tracking-wide mt-1">{label}</div>
    </GlassPanel>
  );
}

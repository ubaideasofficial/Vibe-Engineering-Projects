import React from 'react';
import Link from 'next/link';
import { createClient } from '../../../../lib/supabase/server';
import { isSupabaseConfigured } from '../../../../lib/supabase/config';
import { requireAdminUser } from '../../../../lib/supabase/admin';
import { GlassPanel } from '../../../../components/effects/GlassPanel';
import { ApplicationStatusSelect } from '../../../../components/careers/admin/ApplicationStatusSelect';
import { DownloadResumeButton } from '../../../../components/careers/admin/DownloadResumeButton';
import { SetupNotice } from '../../../../components/careers/SetupNotice';
import type { ApplicationStatus } from '../../../../lib/supabase/types';

export const metadata = { title: 'Applications | Careers Admin' };

interface AdminApplicationRow {
  id: string;
  cover_note: string | null;
  resume_path: string | null;
  status: ApplicationStatus;
  created_at: string;
  jobs: { title: string } | null;
  profiles: { full_name: string; phone: string | null } | null;
}

export default async function AdminApplicationsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="pt-24 bg-[var(--color-steel-950)] min-h-screen pb-24 flex items-center">
        <SetupNotice />
      </div>
    );
  }

  const supabase = await createClient();
  await requireAdminUser(supabase);

  const { data: applications } = await supabase
    .from('applications')
    .select('*, jobs(title), profiles(full_name, phone)')
    .order('created_at', { ascending: false });

  const rows = (applications ?? []) as unknown as AdminApplicationRow[];

  return (
    <div className="pt-24 bg-[var(--color-steel-950)] min-h-screen pb-24 relative">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <Link href="/careers/admin" className="text-sm text-[var(--color-steel-300)] hover:text-white transition-colors">
          ← Admin
        </Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mt-2 mb-8">Applications</h1>

        <div className="space-y-4">
          {rows.map((app) => (
            <GlassPanel key={app.id} dark={true} className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-white font-bold">{app.profiles?.full_name || 'Unnamed candidate'}</h2>
                  {app.profiles?.phone && <p className="text-[var(--color-steel-300)] text-sm">{app.profiles.phone}</p>}
                  <p className="text-[var(--color-steel-300)] text-sm mt-1">Applied for {app.jobs?.title ?? 'a deleted position'}</p>
                  <p className="text-[var(--color-steel-500)] text-xs mt-1">
                    {new Date(app.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  {app.cover_note && <p className="text-[var(--color-steel-300)] text-sm mt-3 whitespace-pre-wrap">{app.cover_note}</p>}
                </div>
                <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                  <ApplicationStatusSelect applicationId={app.id} status={app.status} />
                  <DownloadResumeButton resumePath={app.resume_path} />
                </div>
              </div>
            </GlassPanel>
          ))}
          {rows.length === 0 && <p className="text-[var(--color-steel-300)] text-center py-10">No applications yet.</p>}
        </div>
      </div>
    </div>
  );
}

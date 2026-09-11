import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '../../../../../../lib/supabase/server';
import { isSupabaseConfigured } from '../../../../../../lib/supabase/config';
import { requireAdminUser } from '../../../../../../lib/supabase/admin';
import { JobForm } from '../../../../../../components/careers/admin/JobForm';
import { SetupNotice } from '../../../../../../components/careers/SetupNotice';
import type { Job } from '../../../../../../lib/supabase/types';

export const metadata = { title: 'Edit Job | Careers Admin' };

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="pt-24 bg-[var(--color-steel-950)] min-h-screen pb-24 flex items-center">
        <SetupNotice />
      </div>
    );
  }

  const { id } = await params;
  const supabase = await createClient();
  await requireAdminUser(supabase);

  const { data: job } = await supabase.from('jobs').select('*').eq('id', id).single();
  if (!job) notFound();

  return (
    <div className="pt-24 bg-[var(--color-steel-950)] min-h-screen pb-24 relative">
      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        <Link href="/careers/admin/jobs" className="text-sm text-[var(--color-steel-300)] hover:text-white transition-colors">
          ← Manage Jobs
        </Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mt-2 mb-8">Edit Job</h1>
        <JobForm job={job as Job} />
      </div>
    </div>
  );
}

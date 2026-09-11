import React from 'react';
import Link from 'next/link';
import { createClient } from '../../../../../lib/supabase/server';
import { isSupabaseConfigured } from '../../../../../lib/supabase/config';
import { requireAdminUser } from '../../../../../lib/supabase/admin';
import { JobForm } from '../../../../../components/careers/admin/JobForm';
import { SetupNotice } from '../../../../../components/careers/SetupNotice';

export const metadata = { title: 'New Job | Careers Admin' };

export default async function NewJobPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="pt-24 bg-[var(--color-steel-950)] min-h-screen pb-24 flex items-center">
        <SetupNotice />
      </div>
    );
  }

  const supabase = await createClient();
  await requireAdminUser(supabase);

  return (
    <div className="pt-24 bg-[var(--color-steel-950)] min-h-screen pb-24 relative">
      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        <Link href="/careers/admin/jobs" className="text-sm text-[var(--color-steel-300)] hover:text-white transition-colors">
          ← Manage Jobs
        </Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mt-2 mb-8">Post a New Job</h1>
        <JobForm />
      </div>
    </div>
  );
}

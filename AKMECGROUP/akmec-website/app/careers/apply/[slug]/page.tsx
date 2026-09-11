import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '../../../../lib/supabase/server';
import { isSupabaseConfigured } from '../../../../lib/supabase/config';
import { ApplyForm } from '../../../../components/careers/ApplyForm';
import { SetupNotice } from '../../../../components/careers/SetupNotice';
import type { Job } from '../../../../lib/supabase/types';

export const metadata = { title: 'Apply | Careers at AKMEC LLP' };

export default async function ApplyPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="pt-24 bg-[var(--color-steel-950)] min-h-screen pb-24 flex items-center">
        <SetupNotice />
      </div>
    );
  }

  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/careers/login?redirectedFrom=/careers/apply/${slug}`);
  }

  const { data: job } = await supabase.from('jobs').select('*').eq('slug', slug).eq('status', 'open').single();

  if (!job) notFound();

  return (
    <div className="pt-24 bg-[var(--color-steel-950)] min-h-screen pb-24 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-safety)]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <Link
          href={`/careers/${slug}`}
          className="inline-flex items-center text-sm font-medium text-[var(--color-steel-300)] hover:text-white mb-8 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Position
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">Apply for {(job as Job).title}</h1>
          <p className="text-[var(--color-steel-300)]">
            {(job as Job).department} &middot; {(job as Job).location}
          </p>
        </div>

        <ApplyForm job={job as Job} userId={user.id} />
      </div>
    </div>
  );
}

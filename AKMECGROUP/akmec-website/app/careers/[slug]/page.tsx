import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
import { isSupabaseConfigured } from '../../../lib/supabase/config';
import { GlassPanel } from '../../../components/effects/GlassPanel';
import { SetupNotice } from '../../../components/careers/SetupNotice';
import type { Job } from '../../../lib/supabase/types';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: job } = await supabase.from('jobs').select('title, summary').eq('slug', slug).single();

  if (!job) return { title: 'Position Not Found | AKMEC LLP' };
  return {
    title: `${job.title} | Careers at AKMEC LLP`,
    description: job.summary,
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="pt-24 bg-[var(--color-steel-950)] min-h-screen pb-24 flex items-center">
        <SetupNotice />
      </div>
    );
  }

  const { slug } = await params;
  const supabase = await createClient();

  const [{ data: job }, { data: { user } }] = await Promise.all([
    supabase.from('jobs').select('*').eq('slug', slug).eq('status', 'open').single(),
    supabase.auth.getUser(),
  ]);

  if (!job) notFound();

  const typedJob = job as Job;
  const applyHref = user ? `/careers/apply/${typedJob.slug}` : `/careers/login?redirectedFrom=/careers/apply/${typedJob.slug}`;

  return (
    <div className="pt-24 bg-[var(--color-steel-950)] min-h-screen pb-24 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-safety)]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <Link href="/careers" className="inline-flex items-center text-sm font-medium text-[var(--color-steel-300)] hover:text-white mb-8 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Open Positions
        </Link>

        <GlassPanel dark={true} className="p-8 md:p-12 mb-8">
          <h3 className="text-xs font-display uppercase tracking-widest text-[var(--color-safety)] font-bold mb-3">
            {typedJob.department}
          </h3>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">{typedJob.title}</h1>

          <div className="flex flex-wrap gap-3 mb-8">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-[var(--color-steel-100)] text-xs font-bold">
              {typedJob.location}
            </span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-[var(--color-steel-100)] text-xs font-bold">
              {typedJob.employment_type}
            </span>
            {typedJob.experience_level && (
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-[var(--color-steel-100)] text-xs font-bold">
                {typedJob.experience_level}
              </span>
            )}
          </div>

          <p className="text-[var(--color-steel-300)] leading-relaxed mb-8">{typedJob.description}</p>

          {typedJob.requirements?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-display font-bold text-white mb-4">What You&apos;ll Need</h3>
              <ul className="space-y-3">
                {typedJob.requirements.map((req, i) => (
                  <li key={i} className="flex items-start text-[var(--color-steel-300)]">
                    <svg className="w-5 h-5 text-[var(--color-signal)] mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link
            href={applyHref}
            className="inline-flex items-center justify-center px-10 py-4 bg-[var(--color-safety)] hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-lg"
          >
            {user ? 'Apply for This Position' : 'Sign In to Apply'}
          </Link>
        </GlassPanel>
      </div>
    </div>
  );
}

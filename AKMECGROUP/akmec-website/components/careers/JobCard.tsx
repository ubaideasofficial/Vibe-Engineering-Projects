import React from 'react';
import Link from 'next/link';
import { ClayCard } from '../effects/ClayCard';
import type { Job } from '../../lib/supabase/types';

export function JobCard({ job }: { job: Job }) {
  return (
    <ClayCard className="p-8 h-full flex flex-col hover:-translate-y-2 transition-transform duration-300">
      <h3 className="text-xs font-display uppercase tracking-widest text-[var(--color-safety)] font-bold mb-2">
        {job.department}
      </h3>
      <h4 className="text-2xl font-bold text-[var(--color-steel-950)] mb-3">{job.title}</h4>
      <p className="text-[var(--color-steel-600)] mb-6 flex-grow leading-relaxed">{job.summary}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-steel-100)] text-[var(--color-steel-800)] text-xs font-bold">
          {job.location}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-steel-100)] text-[var(--color-steel-800)] text-xs font-bold">
          {job.employment_type}
        </span>
        {job.experience_level && (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-steel-100)] text-[var(--color-steel-800)] text-xs font-bold">
            {job.experience_level}
          </span>
        )}
      </div>

      <Link
        href={`/careers/${job.slug}`}
        className="mt-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[var(--color-steel-950)] text-white font-bold text-sm hover:bg-[var(--color-safety)] transition-colors"
      >
        View Details &amp; Apply
      </Link>
    </ClayCard>
  );
}

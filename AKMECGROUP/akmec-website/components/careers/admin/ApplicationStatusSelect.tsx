'use client';
import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateApplicationStatus } from '../../../app/careers/admin/applications/actions';
import type { ApplicationStatus } from '../../../lib/supabase/types';

const STATUSES: ApplicationStatus[] = ['submitted', 'reviewing', 'shortlisted', 'rejected', 'hired'];

export function ApplicationStatusSelect({ applicationId, status }: { applicationId: string; status: ApplicationStatus }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const newStatus = e.target.value;
        startTransition(async () => {
          await updateApplicationStatus(applicationId, newStatus);
          router.refresh();
        });
      }}
      className="bg-[var(--color-steel-900)] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--color-safety)] disabled:opacity-60"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  );
}

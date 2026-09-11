'use client';
import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteJob } from '../../../app/careers/admin/jobs/actions';

export function DeleteJobButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteJob(id);
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-sm font-bold text-[var(--color-danger)] hover:text-red-400 transition-colors disabled:opacity-60"
    >
      {isPending ? 'Deleting…' : 'Delete'}
    </button>
  );
}

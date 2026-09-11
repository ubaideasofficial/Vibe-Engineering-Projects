'use client';
import React, { useState } from 'react';
import { getResumeUrl } from '../../../app/careers/admin/applications/actions';

export function DownloadResumeButton({ resumePath }: { resumePath: string | null }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!resumePath) {
    return <span className="text-[var(--color-steel-500)] text-xs">No resume attached</span>;
  }

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = await getResumeUrl(resumePath);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open resume.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="text-sm font-bold text-[var(--color-safety)] hover:text-orange-400 transition-colors disabled:opacity-60"
      >
        {isLoading ? 'Loading…' : 'View Resume'}
      </button>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

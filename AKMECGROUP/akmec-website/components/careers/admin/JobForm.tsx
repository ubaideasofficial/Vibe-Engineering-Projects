'use client';
import React, { useActionState } from 'react';
import { saveJob } from '../../../app/careers/admin/jobs/actions';
import { GlassPanel } from '../../effects/GlassPanel';
import type { Job } from '../../../lib/supabase/types';

const initialState: { error?: string } = {};

export function JobForm({ job }: { job?: Job }) {
  const [state, formAction, isPending] = useActionState(saveJob, initialState);

  return (
    <GlassPanel dark={true} className="p-8 md:p-10">
      <form action={formAction} className="space-y-5">
        {job && <input type="hidden" name="id" value={job.id} />}

        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm font-medium" role="alert">
            {state.error}
          </div>
        )}

        <Field label="Job Title" name="title" defaultValue={job?.title} required />
        {!job && <Field label="URL Slug (optional — auto-generated from title)" name="slug" placeholder="e.g. ndt-technician" />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Department" name="department" defaultValue={job?.department} required />
          <Field label="Location" name="location" defaultValue={job?.location} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Employment Type" name="employment_type" defaultValue={job?.employment_type ?? 'Full-time'} />
          <Field label="Experience Level" name="experience_level" defaultValue={job?.experience_level ?? ''} placeholder="e.g. 3-6 years" />
        </div>

        <TextAreaField label="Summary" name="summary" defaultValue={job?.summary} rows={2} required />
        <TextAreaField label="Full Description" name="description" defaultValue={job?.description} rows={6} required />
        <TextAreaField
          label="Requirements (one per line)"
          name="requirements"
          defaultValue={job?.requirements?.join('\n')}
          rows={5}
        />

        <div>
          <label className="block text-sm font-medium text-[var(--color-steel-300)] mb-2">Status</label>
          <select
            name="status"
            defaultValue={job?.status ?? 'open'}
            className="w-full bg-[var(--color-steel-900)] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-safety)]"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full inline-flex items-center justify-center px-8 py-3.5 bg-[var(--color-safety)] hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? 'Saving…' : job ? 'Save Changes' : 'Post Job'}
        </button>
      </form>
    </GlassPanel>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-steel-300)] mb-2">{label}</label>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        required={required}
        className="w-full bg-[var(--color-steel-900)] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-safety)] focus:ring-1 focus:ring-[var(--color-safety)]"
      />
    </div>
  );
}

function TextAreaField({
  label,
  name,
  defaultValue,
  rows,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows: number;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-steel-300)] mb-2">{label}</label>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ''}
        rows={rows}
        required={required}
        className="w-full bg-[var(--color-steel-900)] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-safety)] focus:ring-1 focus:ring-[var(--color-safety)] resize-none"
      />
    </div>
  );
}

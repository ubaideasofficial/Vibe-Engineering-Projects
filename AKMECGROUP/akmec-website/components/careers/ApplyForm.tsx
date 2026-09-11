'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '../../lib/supabase/client';
import { GlassPanel } from '../effects/GlassPanel';
import type { Job } from '../../lib/supabase/types';

const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5MB

const applySchema = z.object({
  coverNote: z.string().min(20, 'Please write at least a couple of sentences about your fit for this role').max(4000),
  resume: z
    .custom<FileList>()
    .refine((files) => files && files.length === 1, 'Please attach your resume (PDF)')
    .refine((files) => files?.[0]?.type === 'application/pdf', 'Resume must be a PDF file')
    .refine((files) => (files?.[0]?.size ?? 0) <= MAX_RESUME_BYTES, 'Resume must be under 5MB'),
});

type ApplyFormData = z.infer<typeof applySchema>;

export function ApplyForm({ job, userId }: { job: Job; userId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplyFormData>({ resolver: zodResolver(applySchema) });

  const onSubmit = async (data: ApplyFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const supabase = createClient();
    const resumeFile = data.resume[0];
    const resumePath = `${userId}/${job.slug}-${crypto.randomUUID()}.pdf`;

    const { error: uploadError } = await supabase.storage.from('resumes').upload(resumePath, resumeFile, {
      contentType: 'application/pdf',
      upsert: false,
    });

    if (uploadError) {
      setErrorMessage(`Failed to upload resume: ${uploadError.message}`);
      setIsSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from('applications').insert({
      candidate_id: userId,
      job_id: job.id,
      cover_note: data.coverNote,
      resume_path: resumePath,
    });

    if (insertError) {
      setErrorMessage(
        insertError.code === '23505'
          ? 'You have already applied for this position. Check your dashboard for status.'
          : `Failed to submit application: ${insertError.message}`
      );
      setIsSubmitting(false);
      return;
    }

    setIsSuccess(true);
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <GlassPanel dark={true} className="p-8 md:p-12 text-center">
        <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Application Submitted!</h2>
        <p className="text-[var(--color-steel-300)] mb-8">
          Thank you for applying to <span className="text-white font-bold">{job.title}</span>. Our recruitment team will review your
          application and reach out if there&apos;s a match.
        </p>
        <button
          onClick={() => router.push('/careers/dashboard')}
          className="px-6 py-3 bg-[var(--color-safety)] hover:bg-orange-600 text-white font-bold rounded-xl transition-colors"
        >
          Go to My Dashboard
        </button>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel dark={true} className="p-8 md:p-12">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm font-medium" role="alert">
            {errorMessage}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-[var(--color-steel-300)] mb-2">Cover Note</label>
          <textarea
            {...register('coverNote')}
            rows={6}
            className="w-full bg-[var(--color-steel-900)] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-safety)] focus:ring-1 focus:ring-[var(--color-safety)] resize-none"
            placeholder="Tell us why you're a great fit for this role..."
          ></textarea>
          {errors.coverNote && <p className="text-red-400 text-xs mt-1">{errors.coverNote.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-steel-300)] mb-2">Resume (PDF, max 5MB)</label>
          <input
            type="file"
            accept="application/pdf"
            {...register('resume')}
            className="w-full text-sm text-[var(--color-steel-300)] bg-[var(--color-steel-900)] border border-white/10 rounded-xl px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[var(--color-safety)] file:text-white file:font-bold file:text-sm hover:file:bg-orange-600 file:cursor-pointer cursor-pointer"
          />
          {errors.resume && <p className="text-red-400 text-xs mt-1">{errors.resume.message as string}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center px-8 py-4 bg-[var(--color-safety)] hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting Application…' : 'Submit Application'}
        </button>
      </form>
    </GlassPanel>
  );
}

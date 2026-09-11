'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../../../../lib/supabase/server';
import { assertAdmin } from '../../../../lib/supabase/admin';
import type { ApplicationStatus } from '../../../../lib/supabase/types';

const VALID_STATUSES: ApplicationStatus[] = ['submitted', 'reviewing', 'shortlisted', 'rejected', 'hired'];

export async function updateApplicationStatus(applicationId: string, status: string) {
  if (!VALID_STATUSES.includes(status as ApplicationStatus)) {
    throw new Error('Invalid status.');
  }

  const supabase = await createClient();
  await assertAdmin(supabase);

  const { error } = await supabase.from('applications').update({ status }).eq('id', applicationId);
  if (error) throw new Error(error.message);

  revalidatePath('/careers/admin/applications');
}

export async function getResumeUrl(resumePath: string) {
  const supabase = await createClient();
  await assertAdmin(supabase);

  const { data, error } = await supabase.storage.from('resumes').createSignedUrl(resumePath, 60 * 5);
  if (error || !data) throw new Error(error?.message ?? 'Could not generate resume link.');

  return data.signedUrl;
}

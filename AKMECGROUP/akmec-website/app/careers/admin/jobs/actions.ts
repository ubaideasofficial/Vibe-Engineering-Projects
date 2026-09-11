'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '../../../../lib/supabase/server';
import { assertAdmin } from '../../../../lib/supabase/admin';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

interface SaveJobState {
  error?: string;
}

export async function saveJob(_prevState: SaveJobState, formData: FormData): Promise<SaveJobState> {
  const supabase = await createClient();

  try {
    await assertAdmin(supabase);
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Not authorized.' };
  }

  const id = String(formData.get('id') ?? '').trim();
  const job = {
    title: String(formData.get('title') ?? '').trim(),
    department: String(formData.get('department') ?? '').trim(),
    location: String(formData.get('location') ?? '').trim(),
    employment_type: String(formData.get('employment_type') ?? '').trim() || 'Full-time',
    experience_level: String(formData.get('experience_level') ?? '').trim() || null,
    summary: String(formData.get('summary') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    requirements: String(formData.get('requirements') ?? '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
    status: formData.get('status') === 'closed' ? 'closed' : 'open',
  };

  if (!job.title || !job.department || !job.location || !job.summary || !job.description) {
    return { error: 'Please fill in all required fields.' };
  }

  if (id) {
    const { error } = await supabase.from('jobs').update(job).eq('id', id);
    if (error) return { error: error.message };
  } else {
    const slug = slugify(String(formData.get('slug') ?? '').trim() || job.title);
    const { error } = await supabase.from('jobs').insert({ ...job, slug });
    if (error) return { error: error.code === '23505' ? 'A job with that slug already exists.' : error.message };
  }

  revalidatePath('/careers');
  revalidatePath('/careers/admin/jobs');
  redirect('/careers/admin/jobs');
}

export async function deleteJob(id: string) {
  const supabase = await createClient();
  await assertAdmin(supabase);

  const { error } = await supabase.from('jobs').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/careers');
  revalidatePath('/careers/admin/jobs');
}

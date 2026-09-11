import { redirect } from 'next/navigation';
import type { createClient } from './server';

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function getIsAdmin(supabase: ServerSupabaseClient, userId: string) {
  const { data } = await supabase.from('profiles').select('is_admin').eq('id', userId).single();
  return Boolean(data?.is_admin);
}

/** Use in admin page components — redirects unauthenticated/non-admin visitors. */
export async function requireAdminUser(supabase: ServerSupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/careers/login?redirectedFrom=/careers/admin');
  if (!(await getIsAdmin(supabase, user.id))) redirect('/careers');

  return user;
}

/** Use inside Server Actions — actions are public POST endpoints, so re-check here too. */
export async function assertAdmin(supabase: ServerSupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('You must be signed in.');
  if (!(await getIsAdmin(supabase, user.id))) throw new Error('Admin access required.');

  return user;
}

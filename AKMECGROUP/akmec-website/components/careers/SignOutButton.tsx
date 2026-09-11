'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';

export function SignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/careers');
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="text-sm font-medium text-[var(--color-steel-300)] hover:text-white transition-colors disabled:opacity-60"
    >
      {isSigningOut ? 'Signing out…' : 'Sign Out'}
    </button>
  );
}

'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';

export function AuthNav({ isAuthenticated, isAdmin }: { isAuthenticated: boolean; isAdmin?: boolean }) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/careers');
    router.refresh();
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/careers/dashboard"
          className="text-sm font-bold text-[var(--color-steel-100)] hover:text-[var(--color-safety)] transition-colors"
        >
          My Dashboard
        </Link>
        {isAdmin && (
          <Link
            href="/careers/admin"
            className="text-sm font-bold text-[var(--color-safety)] hover:text-orange-400 transition-colors"
          >
            Admin
          </Link>
        )}
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="text-sm font-medium text-[var(--color-steel-300)] hover:text-white transition-colors disabled:opacity-60"
        >
          {isSigningOut ? 'Signing out…' : 'Sign Out'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/careers/login" className="text-sm font-bold text-[var(--color-steel-100)] hover:text-[var(--color-safety)] transition-colors">
        Sign In
      </Link>
      <Link
        href="/careers/signup"
        className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-[var(--color-safety)] rounded-full hover:bg-orange-600 transition-colors"
      >
        Create Account
      </Link>
    </div>
  );
}

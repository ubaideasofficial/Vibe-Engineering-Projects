'use client';
import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '../../../lib/supabase/client';
import { GlassPanel } from '../../../components/effects/GlassPanel';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get('redirectedFrom') || '/careers/dashboard';
  const callbackError = searchParams.get('error');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    callbackError ? 'Your confirmation link could not be verified. Please sign in below or request a new link.' : null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setErrorMessage(error.message === 'Invalid login credentials' ? 'Incorrect email or password.' : error.message);
      setIsSubmitting(false);
      return;
    }

    router.push(redirectedFrom);
    router.refresh();
  };

  return (
    <div className="container mx-auto px-4 max-w-md relative z-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">Candidate Sign In</h1>
        <p className="text-[var(--color-steel-300)]">Sign in to view and manage your job applications.</p>
      </div>

      <GlassPanel dark={true} className="p-8 md:p-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm font-medium" role="alert">
              {errorMessage}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-[var(--color-steel-300)] mb-2">Email Address</label>
            <input
              type="email"
              {...register('email')}
              className="w-full bg-[var(--color-steel-900)] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-safety)] focus:ring-1 focus:ring-[var(--color-safety)]"
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-steel-300)] mb-2">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full bg-[var(--color-steel-900)] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-safety)] focus:ring-1 focus:ring-[var(--color-safety)]"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center px-8 py-3.5 bg-[var(--color-safety)] hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing In…' : 'Sign In'}
          </button>
        </form>
      </GlassPanel>

      <p className="text-center text-[var(--color-steel-300)] text-sm mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/careers/signup" className="text-[var(--color-safety)] font-bold hover:text-orange-400 transition-colors">
          Create One
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="pt-24 bg-[var(--color-steel-950)] min-h-screen pb-20 relative flex items-center">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-safety)]/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-signal)]/10 blur-[100px] rounded-full pointer-events-none" />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '../../../lib/supabase/client';
import { GlassPanel } from '../../../components/effects/GlassPanel';

const signupSchema = z
  .object({
    fullName: z.string().min(2, 'Please enter your full name'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const supabase = createClient();
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);

    // If email confirmation is disabled on the Supabase project, a session is
    // returned immediately and the candidate can go straight to their dashboard.
    if (signUpData.session) {
      router.push('/careers/dashboard');
      router.refresh();
      return;
    }

    setIsSuccess(true);
  };

  return (
    <div className="pt-24 bg-[var(--color-steel-950)] min-h-screen pb-20 relative flex items-center">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-safety)]/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-signal)]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">Create Your Candidate Account</h1>
          <p className="text-[var(--color-steel-300)]">Sign up to apply for open positions at AKMEC.</p>
        </div>

        <GlassPanel dark={true} className="p-8 md:p-10">
          {isSuccess ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Check Your Email</h2>
              <p className="text-[var(--color-steel-300)] text-sm">
                We&apos;ve sent a confirmation link to your email address. Confirm it to activate your account, then sign in.
              </p>
              <Link href="/careers/login" className="inline-block mt-6 text-[var(--color-safety)] font-bold hover:text-orange-400 transition-colors">
                Go to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm font-medium" role="alert">
                  {errorMessage}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-[var(--color-steel-300)] mb-2">Full Name</label>
                <input
                  type="text"
                  {...register('fullName')}
                  className="w-full bg-[var(--color-steel-900)] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-safety)] focus:ring-1 focus:ring-[var(--color-safety)]"
                  placeholder="John Doe"
                />
                {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
              </div>
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
                  placeholder="At least 8 characters"
                />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-steel-300)] mb-2">Confirm Password</label>
                <input
                  type="password"
                  {...register('confirmPassword')}
                  className="w-full bg-[var(--color-steel-900)] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-safety)] focus:ring-1 focus:ring-[var(--color-safety)]"
                />
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center px-8 py-3.5 bg-[var(--color-safety)] hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating Account…' : 'Create Account'}
              </button>
            </form>
          )}
        </GlassPanel>

        <p className="text-center text-[var(--color-steel-300)] text-sm mt-6">
          Already have an account?{' '}
          <Link href="/careers/login" className="text-[var(--color-safety)] font-bold hover:text-orange-400 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

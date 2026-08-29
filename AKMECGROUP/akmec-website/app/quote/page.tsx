'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { services } from '../../data/services';
import { GlassPanel } from '../../components/effects/GlassPanel';

const quoteSchema = z.object({
  serviceType: z.string().min(1, "Please select a service"),
  urgency: z.enum(['low', 'medium', 'high', 'emergency']),
  details: z.string().min(10, "Please provide more details"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(2, "Company name is required"),
  phone: z.string().min(5, "Phone number is required")
});

type QuoteFormData = z.infer<typeof quoteSchema>;

export default function QuotePage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, trigger, formState: { errors } } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema)
  });

  const handleNext = async () => {
    const fieldsToValidate = step === 1 
      ? ['serviceType', 'urgency', 'details'] as const
      : ['name', 'email', 'company', 'phone'] as const;
      
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep(step + 1);
  };

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('Quote submission failed', error);
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 bg-[var(--color-steel-950)] min-h-screen pb-20 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-safety)]/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-signal)]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Request a Quote</h1>
          <p className="text-[var(--color-steel-300)]">Get a detailed estimate for your project requirements.</p>
        </div>

        {isSuccess ? (
           <GlassPanel dark={true} className="p-12 text-center">
             <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6">
               <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
               </svg>
             </div>
             <h2 className="text-2xl font-bold text-white mb-4">Request Submitted Successfully!</h2>
             <p className="text-[var(--color-steel-300)] mb-8">Our technical team will review your requirements and get back to you within 24 hours.</p>
             <button onClick={() => { setIsSuccess(false); setStep(1); }} className="px-6 py-3 bg-[var(--color-safety)] hover:bg-orange-600 text-white font-bold rounded-xl transition-colors">
               Submit Another Request
             </button>
           </GlassPanel>
        ) : (
          <GlassPanel dark={true} className="p-8 md:p-12">
            {/* Progress Bar */}
            <div className="mb-10 relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full"></div>
              <div 
                className="absolute top-1/2 left-0 h-1 bg-[var(--color-safety)] -translate-y-1/2 rounded-full transition-all duration-500"
                style={{ width: step === 1 ? '50%' : '100%' }}
              ></div>
              <div className="relative flex justify-between">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1 ? 'bg-[var(--color-safety)] text-white shadow-[0_0_10px_rgba(255,106,0,0.5)]' : 'bg-gray-700 text-gray-400'}`}>1</div>
                  <span className="text-xs text-[var(--color-steel-300)] mt-2 font-medium">Project Details</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2 ? 'bg-[var(--color-safety)] text-white shadow-[0_0_10px_rgba(255,106,0,0.5)]' : 'bg-[var(--color-steel-800)] text-gray-400 border border-white/10'}`}>2</div>
                  <span className="text-xs text-[var(--color-steel-300)] mt-2 font-medium">Contact Info</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1 */}
              <div className={step === 1 ? 'block' : 'hidden'}>
                <h3 className="text-xl font-display font-bold text-white mb-6">1. Project Details</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-steel-300)] mb-2">Service Required</label>
                    <select 
                      {...register("serviceType")}
                      className="w-full bg-[var(--color-steel-900)] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-safety)] focus:ring-1 focus:ring-[var(--color-safety)] appearance-none"
                    >
                      <option value="">Select a service category</option>
                      {services.map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                    {errors.serviceType && <p className="text-red-400 text-xs mt-1">{errors.serviceType.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-steel-300)] mb-2">Urgency Level</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['low', 'medium', 'high', 'emergency'].map((level) => (
                        <label key={level} className="cursor-pointer">
                          <input type="radio" value={level} {...register("urgency")} className="sr-only peer" />
                          <div className="text-center px-3 py-2 rounded-lg border border-white/10 bg-[var(--color-steel-900)] text-sm font-medium text-[var(--color-steel-300)] peer-checked:bg-[var(--color-safety)]/20 peer-checked:border-[var(--color-safety)] peer-checked:text-white transition-all capitalize">
                            {level}
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.urgency && <p className="text-red-400 text-xs mt-1">{errors.urgency.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-steel-300)] mb-2">Project Requirements</label>
                    <textarea 
                      {...register("details")}
                      rows={5}
                      className="w-full bg-[var(--color-steel-900)] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-safety)] focus:ring-1 focus:ring-[var(--color-safety)] resize-none"
                      placeholder="Please describe the scope of work, location, and specific standards..."
                    ></textarea>
                    {errors.details && <p className="text-red-400 text-xs mt-1">{errors.details.message}</p>}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button type="button" onClick={handleNext} className="px-8 py-3 bg-[var(--color-safety)] hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-lg">
                    Next Step
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className={step === 2 ? 'block' : 'hidden'}>
                <h3 className="text-xl font-display font-bold text-white mb-6">2. Contact Information</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-steel-300)] mb-2">Full Name</label>
                      <input 
                        type="text" 
                        {...register("name")}
                        className="w-full bg-[var(--color-steel-900)] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-safety)] focus:ring-1 focus:ring-[var(--color-safety)]"
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-steel-300)] mb-2">Company Name</label>
                      <input 
                        type="text" 
                        {...register("company")}
                        className="w-full bg-[var(--color-steel-900)] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-safety)] focus:ring-1 focus:ring-[var(--color-safety)]"
                      />
                      {errors.company && <p className="text-red-400 text-xs mt-1">{errors.company.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-steel-300)] mb-2">Email Address</label>
                      <input 
                        type="email" 
                        {...register("email")}
                        className="w-full bg-[var(--color-steel-900)] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-safety)] focus:ring-1 focus:ring-[var(--color-safety)]"
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-steel-300)] mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        {...register("phone")}
                        className="w-full bg-[var(--color-steel-900)] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-safety)] focus:ring-1 focus:ring-[var(--color-safety)]"
                      />
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button type="button" onClick={() => setStep(1)} className="px-6 py-3 bg-[var(--color-steel-800)] hover:bg-[var(--color-steel-700)] text-white font-medium rounded-xl transition-colors">
                    Back
                  </button>
                  <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-[var(--color-safety)] hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center">
                    {isSubmitting && (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    Submit Request
                  </button>
                </div>
              </div>
            </form>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}


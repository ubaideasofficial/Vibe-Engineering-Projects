'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { offices } from '../../data/offices';
import { ClayCard } from '../../components/effects/ClayCard';

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('Contact submission failed', error);
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 bg-[var(--color-steel-050)] min-h-screen">
      
      {/* Global Presence Map */}
      <section className="bg-[var(--color-steel-950)] py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/media/brand/world-map.png"
            alt="Global Presence Map"
            fill
            className="object-contain opacity-20 filter invert"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">Global Presence</h1>
          <p className="text-xl text-[var(--color-steel-300)] max-w-2xl mx-auto">
            Worldwide reach, trusted everywhere. Contact one of our global offices to discuss your industrial requirements.
          </p>
        </div>
      </section>

      {/* Offices Grid */}
      <section className="py-16 -mt-10 relative z-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map(office => (
              <ClayCard key={office.id} className="p-8 h-full flex flex-col hover:-translate-y-2 transition-transform duration-300">
                <h3 className="text-sm font-display uppercase tracking-widest text-[var(--color-safety)] font-bold mb-2">{office.type}</h3>
                <h4 className="text-2xl font-bold text-[var(--color-steel-950)] mb-4">{office.name}</h4>
                <p className="text-[var(--color-steel-600)] mb-6 flex-grow">{office.address}</p>
                
                <div className="space-y-3 mt-auto pt-4 border-t border-[var(--color-steel-300)]/30">
                  {office.email && (
                    <a href={`mailto:${office.email}`} className="flex items-center text-sm text-[var(--color-steel-800)] font-medium hover:text-[var(--color-safety)]">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {office.email}
                    </a>
                  )}
                  {office.phones?.map(phone => (
                    <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center text-sm text-[var(--color-steel-800)] font-medium hover:text-[var(--color-safety)]">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {phone}
                    </a>
                  ))}
                </div>
              </ClayCard>
            ))}
          </div>
        </div>
      </section>

      {/* Neumorphic Contact Form */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-[var(--color-steel-100)] rounded-[3rem] p-8 md:p-16 shadow-[20px_20px_60px_#c5cad1,-20px_-20px_60px_#ffffff]">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-[var(--color-steel-900)] mb-4">Send Us a Message</h2>
              <p className="text-[var(--color-steel-600)]">Fill out the form below and our team will get back to you promptly.</p>
            </div>

            {isSuccess ? (
              <div className="bg-green-50 text-green-800 p-8 rounded-2xl text-center shadow-inner">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-2xl font-bold mb-2">Message Sent Successfully!</h3>
                <p>Thank you for reaching out to AKMEC. We will be in touch shortly.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-6 px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[var(--color-steel-700)] mb-2 ml-4">Full Name</label>
                    <input 
                      type="text" 
                      {...register("name")}
                      className={`w-full bg-[var(--color-steel-100)] px-6 py-4 rounded-2xl shadow-[inset_6px_6px_12px_#c5cad1,inset_-6px_-6px_12px_#ffffff] focus:outline-none border-[3px] border-transparent focus:border-[var(--color-safety)]/50 transition-all ${errors.name ? 'border-red-400' : ''}`}
                      placeholder="John Doe"
                    />
                    {errors.name && <span className="text-red-500 text-xs ml-4 mt-1 block">{errors.name.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--color-steel-700)] mb-2 ml-4">Email Address</label>
                    <input 
                      type="email" 
                      {...register("email")}
                      className={`w-full bg-[var(--color-steel-100)] px-6 py-4 rounded-2xl shadow-[inset_6px_6px_12px_#c5cad1,inset_-6px_-6px_12px_#ffffff] focus:outline-none border-[3px] border-transparent focus:border-[var(--color-safety)]/50 transition-all ${errors.email ? 'border-red-400' : ''}`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <span className="text-red-500 text-xs ml-4 mt-1 block">{errors.email.message}</span>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[var(--color-steel-700)] mb-2 ml-4">Phone (Optional)</label>
                    <input 
                      type="tel" 
                      {...register("phone")}
                      className="w-full bg-[var(--color-steel-100)] px-6 py-4 rounded-2xl shadow-[inset_6px_6px_12px_#c5cad1,inset_-6px_-6px_12px_#ffffff] focus:outline-none border-[3px] border-transparent focus:border-[var(--color-safety)]/50 transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--color-steel-700)] mb-2 ml-4">Subject</label>
                    <input 
                      type="text" 
                      {...register("subject")}
                      className={`w-full bg-[var(--color-steel-100)] px-6 py-4 rounded-2xl shadow-[inset_6px_6px_12px_#c5cad1,inset_-6px_-6px_12px_#ffffff] focus:outline-none border-[3px] border-transparent focus:border-[var(--color-safety)]/50 transition-all ${errors.subject ? 'border-red-400' : ''}`}
                      placeholder="Inspection Services Inquiry"
                    />
                    {errors.subject && <span className="text-red-500 text-xs ml-4 mt-1 block">{errors.subject.message}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--color-steel-700)] mb-2 ml-4">Message</label>
                  <textarea 
                    {...register("message")}
                    rows={5}
                    className={`w-full bg-[var(--color-steel-100)] px-6 py-4 rounded-2xl shadow-[inset_6px_6px_12px_#c5cad1,inset_-6px_-6px_12px_#ffffff] focus:outline-none border-[3px] border-transparent focus:border-[var(--color-safety)]/50 transition-all resize-none ${errors.message ? 'border-red-400' : ''}`}
                    placeholder="Tell us about your requirements..."
                  ></textarea>
                  {errors.message && <span className="text-red-500 text-xs ml-4 mt-1 block">{errors.message.message}</span>}
                </div>

                <div className="pt-4 text-center">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center px-12 py-5 bg-[var(--color-steel-100)] rounded-full text-[var(--color-safety)] font-bold text-lg shadow-[8px_8px_16px_#c5cad1,-8px_-8px_16px_#ffffff] hover:shadow-[4px_4px_8px_#c5cad1,-4px_-4px_8px_#ffffff] active:shadow-[inset_6px_6px_12px_#c5cad1,inset_-6px_-6px_12px_#ffffff] transition-all disabled:opacity-70 disabled:pointer-events-none"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

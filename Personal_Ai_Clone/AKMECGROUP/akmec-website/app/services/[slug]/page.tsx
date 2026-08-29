import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { services } from '../../../data/services';
import { GlassPanel } from '../../../components/effects/GlassPanel';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

// Next.js 15+ dynamic params
export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const service = services.find((s) => s.slug === resolvedParams.slug);

  if (!service) {
    notFound();
  }

  const isNDT = service.id === 'examination-testing';

  return (
    <div className="bg-[var(--color-steel-950)] min-h-screen pt-12">
      {/* Hero Strip */}
      <section className="relative h-[40vh] min-h-[400px] flex items-end pb-16">
        <div className="absolute inset-0 z-0">
          <Image 
            src={service.thumbnail} 
            alt={service.title}
            fill
            className="object-cover mix-blend-luminosity opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-steel-950)] via-[var(--color-steel-950)]/80 to-[var(--color-steel-950)]/20" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Link href="/services" className="inline-flex items-center text-[var(--color-steel-300)] hover:text-white text-sm mb-6 uppercase tracking-wider font-bold transition-colors">
            <svg className="w-4 h-4 mr-2 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            All Services
          </Link>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
            {service.title}
          </h1>
          <p className="text-xl text-[var(--color-steel-300)] max-w-3xl">
            {service.shortDescription}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-8">
              
              {isNDT && service.categories ? (
                /* Tabbed NDT Explorer (Conceptual Layout) */
                <div className="space-y-12">
                  <h2 className="text-3xl font-display font-bold text-white mb-8 border-b border-white/10 pb-4">NDT Methods & Techniques</h2>
                  {service.categories.map((cat, idx) => (
                    <GlassPanel key={idx} dark={true} className="p-8 border border-white/10">
                      <h3 className="text-2xl font-display font-bold text-[var(--color-safety)] mb-6">{cat.title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cat.items.map((item, i) => (
                          <div key={i} className="flex items-start">
                            <CheckCircle2 className="w-5 h-5 text-[var(--color-signal)] mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-[var(--color-steel-100)]">{item}</span>
                          </div>
                        ))}
                      </div>
                    </GlassPanel>
                  ))}
                </div>
              ) : (
                /* Standard Capability List */
                <div>
                  <h2 className="text-3xl font-display font-bold text-white mb-8 border-b border-white/10 pb-4">Core Capabilities</h2>
                  
                  {service.categories ? (
                    service.categories.map((cat, idx) => (
                      <div key={idx} className="mb-10">
                        <h3 className="text-xl font-bold text-[var(--color-steel-300)] mb-6">{cat.title}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {cat.items.map((item, i) => (
                            <div key={i} className="flex items-start">
                              <CheckCircle2 className="w-5 h-5 text-[var(--color-signal)] mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-[var(--color-steel-100)]">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.capabilities.map((item, i) => (
                        <div key={i} className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 text-[var(--color-signal)] mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-[var(--color-steel-100)]">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              <GlassPanel dark={true} className="p-8 border border-[var(--color-safety)]/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-safety)]/10 rounded-bl-full blur-2xl"></div>
                <h3 className="text-2xl font-display font-bold text-white mb-4 relative z-10">Request a Service</h3>
                <p className="text-[var(--color-steel-300)] mb-6 relative z-10">
                  Ready to deploy our experts for your next project? Get a detailed quote today.
                </p>
                <Link 
                  href="/quote"
                  className="inline-flex items-center justify-center w-full py-4 px-6 bg-[var(--color-safety)] hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-lg relative z-10"
                >
                  Request Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </GlassPanel>

              <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
                <h3 className="text-xl font-display font-bold text-white mb-6">Need Immediate Assistance?</h3>
                <div className="space-y-4">
                  <a href="tel:+919226112227" className="flex items-center text-[var(--color-steel-300)] hover:text-white transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +91 9226112227
                  </a>
                  <a href="mailto:inquiry@akmecgroup.com" className="flex items-center text-[var(--color-steel-300)] hover:text-white transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    inquiry@akmecgroup.com
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}


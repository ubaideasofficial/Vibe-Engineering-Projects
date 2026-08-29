import React from 'react';
import Image from 'next/image';
import { CallToAction } from '../../components/sections/CallToAction';
import { MissionVision } from '../../components/sections/MissionVision';

export const metadata = {
  title: 'About Us | AKMEC LLP',
  description: 'Learn about AKMEC LLP, our global service footprint, our core values of Quality & Trust, and our mission to build a safer industrial future.',
};

export default function AboutPage() {
  return (
    <div className="pt-20">
      <section className="bg-[var(--color-steel-050)] py-24 border-b border-black/5">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-[var(--color-steel-950)] mb-8">Who We Are</h1>
          <div className="w-24 h-1 bg-[var(--color-safety)] mx-auto mb-12"></div>
          
          <p className="text-xl md:text-2xl text-[var(--color-steel-800)] leading-relaxed mb-12">
            Since 2021, AKMEC has been at the forefront of delivering complete industrial solutions. We pride ourselves on being <strong>Committed to Value, Committed to Excellence</strong>.
          </p>
          <p className="text-lg text-[var(--color-steel-600)] leading-relaxed mb-8">
            Operating with a worldwide reach, our expert teams specialize in Inspection, Audit, Testing, Asset Integrity, and Manpower Outsourcing. Whether we are assessing critical infrastructure in India or Saudi Arabia, we bring ISO 9001:2015 certified precision to every job.
          </p>
        </div>
      </section>

      <div className="w-full h-[50vh] relative mix-blend-multiply">
        <Image 
          src="/media/hero/about-industrial-pvf.webp"
          alt="Industrial Pipes, Valves and Fittings"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[var(--color-steel-900)]/40" />
      </div>

      <MissionVision />
      
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold text-[var(--color-steel-950)] mb-6">Our Six Core Qualities</h2>
              <div className="space-y-6">
                {['Compliance', 'Transparency', 'Availability', 'Quality', 'Competence', 'Reliability'].map((quality, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-steel-100)] flex items-center justify-center mr-4 shadow-inner">
                      <div className="w-4 h-4 rounded-full bg-[var(--color-signal)]"></div>
                    </div>
                    <span className="text-2xl font-bold text-[var(--color-steel-800)]">{quality}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square max-w-md mx-auto w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-steel-100)] to-white rounded-[3rem] shadow-[inset_10px_10px_20px_rgba(0,0,0,0.05),inset_-10px_-10px_20px_rgba(255,255,255,0.8)] border border-white flex items-center justify-center p-12">
                <div className="w-full h-full relative">
                  <Image 
                    src="/media/brand/akmec-logo-web.png"
                    alt="AKMEC Logo"
                    fill
                    sizes="(max-width: 768px) 280px, 420px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CallToAction />
    </div>
  );
}


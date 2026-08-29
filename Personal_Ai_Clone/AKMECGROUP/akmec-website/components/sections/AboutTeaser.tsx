import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function AboutTeaser() {
  return (
    <section className="bg-[var(--color-steel-050)] text-[var(--color-steel-900)] py-32 md:py-48">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-12">Who We Are</h2>
        
        <p className="text-xl md:text-[21px] leading-relaxed mb-16 max-w-3xl mx-auto">
          AKMEC is committed to delivering end-to-end industrial services — ensuring safety, compliance and client satisfaction in every project. Since 2021, we have been empowering industries with trusted inspection, technical solutions, and a global service footprint.
        </p>

        <div className="w-16 h-px bg-[var(--color-steel-900)] mx-auto mb-16 opacity-20"></div>

        <Link 
          href="/about" 
          className="inline-flex items-center text-sm font-bold uppercase tracking-wider hover:text-[var(--color-safety)] transition-colors group"
        >
          Read the full story
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-32 w-full h-[60vh] relative mix-blend-multiply">
        <div className="absolute inset-0 bg-teal-900/20 z-10 pointer-events-none mix-blend-color" />
        <Image 
          src="/media/hero/about-industrial-pvf.webp"
          alt="Industrial Pipes, Valves and Fittings"
          fill
          className="object-cover grayscale"
        />
      </div>
    </section>
  );
}


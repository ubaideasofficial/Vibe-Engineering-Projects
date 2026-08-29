'use client';
import React from 'react';
import Link from 'next/link';
import { LiquidGlass } from '../effects/LiquidGlass';
import { ArrowRight } from 'lucide-react';

export function CallToAction() {
  return (
    <section className="py-24 bg-[var(--color-steel-950)] relative overflow-hidden flex items-center justify-center">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[var(--color-safety)]/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
        <LiquidGlass className="p-12 md:p-20 rounded-[3rem] border border-white/20 shadow-2xl backdrop-blur-2xl bg-white/5" interactive={true}>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Ready to Ensure Excellence?
          </h2>
          <p className="text-xl text-[var(--color-steel-300)] mb-10 max-w-2xl mx-auto">
            Partner with AKMEC for world-class inspection, testing, and technical solutions. Our experts are ready for mobilization.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/quote" 
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-[var(--color-safety)] hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,106,0,0.3)] hover:shadow-[0_0_30px_rgba(255,106,0,0.5)] group"
            >
              Request a Quote
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              href="/contact" 
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/10"
            >
              Contact Our Offices
            </Link>
          </div>
        </LiquidGlass>
      </div>
    </section>
  );
}


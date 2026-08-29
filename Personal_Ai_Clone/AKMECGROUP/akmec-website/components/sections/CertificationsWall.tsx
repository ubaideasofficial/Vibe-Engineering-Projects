'use client';
import React from 'react';
import { certifications } from '../../data/certifications';
import { BrutalBox } from '../effects/BrutalBox';

export function CertificationsWall() {
  return (
    <section className="bg-white py-24 border-y-4 border-black relative overflow-hidden">
      {/* Background brutalist pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 10px)' }}></div>
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="mb-16 border-b-4 border-black pb-6 inline-block">
          <h2 className="text-5xl md:text-7xl font-display font-black text-black uppercase tracking-tighter">
            Certified Excellence
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {certifications.map((category, idx) => (
            <div key={idx} className="flex flex-col">
              <h3 className="bg-black text-white font-display uppercase font-bold px-4 py-2 inline-block self-start mb-6 text-lg md:text-xl transform -skew-x-6">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-4">
                {category.items.map((item, i) => (
                  <BrutalBox 
                    key={i} 
                    className="px-4 py-3 bg-[var(--color-steel-050)] font-mono text-sm md:text-base font-bold text-black uppercase hover:bg-yellow-300"
                  >
                    {item}
                  </BrutalBox>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ClayCard } from '../effects/ClayCard';

export function MissionVision() {
  return (
    <section className="py-24 bg-[var(--color-steel-050)] relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 -mr-48 -mt-48 opacity-10 pointer-events-none">
        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className="w-[800px] h-[800px] fill-[var(--color-safety)]">
          <path d="M43.5,-75.4C56,-68.8,65.5,-55.1,73.5,-41.2C81.5,-27.3,87.9,-13.6,86.6,-0.7C85.3,12.2,76.3,24.4,68.2,36.7C60.1,49,52.8,61.4,41.9,69.5C31,77.6,16.5,81.4,1.8,78.3C-12.9,75.2,-25.9,65.2,-37.8,55.7C-49.8,46.2,-60.7,37.2,-68.9,25.4C-77.1,13.6,-82.6,-0.9,-81.4,-15.1C-80.2,-29.3,-72.3,-43.2,-61.1,-52.1C-49.9,-61.1,-35.4,-65,-22.1,-70C-8.8,-75,3.3,-81.1,17.2,-79.8C31.1,-78.5,31,-82,43.5,-75.4Z" transform="translate(250 250)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <ClayCard className="h-full p-10 md:p-14 relative group">
              <div className="absolute top-10 right-10 w-24 h-24 bg-[var(--color-safety)]/10 rounded-full blur-2xl group-hover:bg-[var(--color-safety)]/20 transition-all duration-500"></div>
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 border border-[var(--color-steel-100)]">
                <svg className="w-8 h-8 text-[var(--color-safety)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-display text-3xl font-bold text-[var(--color-steel-950)] mb-6">Our Mission</h3>
              <p className="text-lg text-[var(--color-steel-800)] leading-relaxed font-medium">
                AKMEC is committed to delivering end-to-end industrial services — ensuring safety, compliance and client satisfaction in every project.
              </p>
            </ClayCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ClayCard className="h-full p-10 md:p-14 relative group">
              <div className="absolute top-10 right-10 w-24 h-24 bg-[var(--color-signal)]/10 rounded-full blur-2xl group-hover:bg-[var(--color-signal)]/20 transition-all duration-500"></div>
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 border border-[var(--color-steel-100)]">
                <svg className="w-8 h-8 text-[var(--color-signal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="font-display text-3xl font-bold text-[var(--color-steel-950)] mb-6">Our Vision</h3>
              <p className="text-lg text-[var(--color-steel-800)] leading-relaxed font-medium">
                AKMEC strives to build a safer, smarter and more sustainable industrial future — driving excellence through innovation, integrity and trusted partnerships.
              </p>
            </ClayCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
}


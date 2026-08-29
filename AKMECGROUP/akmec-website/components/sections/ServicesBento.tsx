'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { services } from '../../data/services';
import { ArrowUpRight } from 'lucide-react';

export function ServicesBento() {
  return (
    <section className="py-24 bg-[var(--color-steel-950)] text-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px]">
        <div className="mb-16 md:flex justify-between items-end">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Core Capabilities</h2>
            <p className="text-[var(--color-steel-300)] text-lg">Delivering precision and reliability across six specialized service pillars.</p>
          </div>
          <Link href="/services" className="hidden md:inline-flex items-center text-[var(--color-safety)] hover:text-orange-400 font-bold uppercase text-sm tracking-wider group mt-6 md:mt-0">
            View All Services
            <ArrowUpRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        {/* 12-col Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 auto-rows-[280px]">
          {services.map((service, index) => {
            // Asymmetric spans
            let spanClass = "md:col-span-4";
            if (index === 0) spanClass = "md:col-span-8 md:row-span-2"; // Inspection & Audit (hero tile)
            if (index === 1) spanClass = "md:col-span-4 md:row-span-2"; // NDT Testing
            if (index === 2) spanClass = "md:col-span-6"; // Asset Integrity
            if (index === 3) spanClass = "md:col-span-6"; // Manpower
            if (index === 4) spanClass = "md:col-span-8"; // Training
            if (index === 5) spanClass = "md:col-span-4"; // Heat Treatment

            return (
              <motion.div 
                key={service.id}
                className={`group relative overflow-hidden rounded-2xl bg-[var(--color-steel-900)] border border-white/5 ${spanClass}`}
                whileHover={{ scale: 0.99, rotateX: 2, rotateY: -2 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ perspective: "1000px" }}
              >
                <Link href={`/services/${service.slug}`} className="absolute inset-0 z-20">
                  <span className="sr-only">View {service.title}</span>
                </Link>
                
                {/* Background Image with Duotone/Steel grade */}
                <div className="absolute inset-0 mix-blend-luminosity opacity-40 group-hover:opacity-60 transition-opacity duration-500">
                  <Image 
                    src={service.thumbnail}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-steel-950)] via-[var(--color-steel-950)]/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-2xl md:text-3xl font-bold">{service.title}</h3>
                    <div className="w-10 h-10 rounded-full bg-[var(--color-safety)]/10 text-[var(--color-safety)] flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <p className="text-[var(--color-steel-300)] text-sm md:text-base mb-4 max-w-lg line-clamp-2">
                    {service.shortDescription}
                  </p>

                  {/* Discipline tags (only show on larger tiles) */}
                  {(index === 0 || index === 2 || index === 4) && (
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {service.capabilities.slice(0, 3).map((cap, i) => (
                        <span key={i} className="text-xs font-mono text-[var(--color-steel-300)] bg-white/5 px-3 py-1.5 rounded-sm border border-white/10">
                          {cap}
                        </span>
                      ))}
                      {service.capabilities.length > 3 && (
                        <span className="text-xs font-mono text-[var(--color-steel-300)] px-2 py-1.5">
                          +{service.capabilities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { industries } from '../../data/industries';

const visualMap: Record<string, string> = {
  'oil-and-gas': '/media/hero/refinery-tanks-dusk.jpg',
  refinery: '/media/hero/refinery-tanks-dusk.jpg',
  petrochemical: '/media/hero/slider-oil-and-gas.webp',
  chemical: '/media/services/insp-pressure-vessel-fabrication.jpg',
  fertilizer: '/media/services/insp-container-preshipment.jpg',
  nuclear: '/media/services/consulting-services-web.jpeg',
  marine: '/media/ndt/field-ndt-crew-site.jpg',
  mining: '/media/hero/about-industrial-pvf.webp',
  'sugar-industries': '/media/hero/slider-plant-inspection.webp',
  'port-shipping': '/media/services/insp-container-preshipment.jpg',
  cement: '/media/services/construction-web.jpg',
  'power-generation': '/media/hero/offshore-platform-aerial.jpg',
  'metal-fabrication': '/media/hero/about-industrial-pvf.webp',
  'forging-casting': '/media/ndt/heat-treatment-web.webp',
  manufacturing: '/media/ndt/field-ndt-crew-site.jpg',
  pipeline: '/media/hero/refinery-tanks-dusk.jpg',
  tanks: '/media/hero/refinery-tanks-dusk.jpg',
  'epc-turnkey': '/media/hero/slider-plant-inspection.webp',
  'electronics-electricals': '/media/ndt/infrared-thermography-panel.jpg',
  construction: '/media/services/construction-web.jpg',
  solar: '/media/hero/about-industrial-pvf.webp',
  wind: '/media/hero/about-industrial-pvf.webp',
  'building-infrastructure': '/media/services/construction-web.jpg',
  'food-beverages': '/media/manpower/workforce-group.jpg',
  'railways-metro': '/media/services/insp-offshore-lifting.jpg',
  'aerospace-defense': '/media/services/insp-workshop-qc-tablet.png',
  'pharmaceutical-medical': '/media/manpower/training-classroom.jpg',
  automobile: '/media/ndt/ut-thickness-probe.jpg',
  textile: '/media/manpower/training-classroom.jpg',
  transportation: '/media/services/insp-container-preshipment.jpg',
  'general-industries': '/media/services/industrial-services-web.jpg',
  'pulp-paper': '/media/hero/slider-oil-and-gas.webp',
  'renewable-energy': '/media/hero/about-industrial-pvf.webp',
};

const colors = [
  'bg-blue-600', 'bg-indigo-600', 'bg-[var(--color-safety)]', 'bg-[var(--color-signal)]',
  'bg-purple-600', 'bg-rose-600', 'bg-[var(--color-warn)]', 'bg-emerald-600'
];

export function IndustriesMaximalist() {
  return (
    <section className="bg-[#f7f7f5] py-24 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30" />

      <div className="container mx-auto px-4 relative z-10 max-w-[1600px]">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-16">
          <h2 className="text-6xl md:text-8xl font-display font-black text-slate-950 uppercase tracking-tighter leading-none mb-4 md:mb-0">
            Industries <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500">We Serve</span>
          </h2>
          <Link href="/industries" className="text-slate-900 text-xl font-bold uppercase hover:text-[var(--color-safety)] transition-colors inline-flex items-center group">
            View All 33
            <svg className="w-8 h-8 ml-2 transform group-hover:rotate-45 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4 auto-rows-[160px] md:auto-rows-[200px]">
          {industries.slice(0, 16).map((industry, i) => {
            const imgUrl = visualMap[industry.id] || '/media/hero/refinery-tanks-dusk.jpg';
            const shouldUseImage = [0, 2, 3, 5, 7, 9, 11, 13].includes(i);
            const colorClass = colors[i % colors.length];

            let spanClass = 'col-span-2 row-span-1';
            if (i === 0 || i === 7) spanClass = 'col-span-2 md:col-span-4 lg:col-span-4 row-span-2';
            if (i === 2 || i === 11) spanClass = 'col-span-2 md:col-span-2 lg:col-span-2 row-span-2';

            return (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`group relative overflow-hidden ${spanClass} ${!shouldUseImage ? colorClass : 'bg-[var(--color-steel-900)]'}`}
              >
                <Link href={`/industries#${industry.id}`} className="absolute inset-0 z-20">
                  <span className="sr-only">View {industry.name}</span>
                </Link>

                {shouldUseImage && (
                  <div className="absolute inset-0 mix-blend-luminosity opacity-80 group-hover:opacity-100 transition-all duration-700">
                    <Image
                      src={imgUrl}
                      alt={industry.name}
                      fill
                      className="object-cover grayscale transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                )}

                {!shouldUseImage && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]" />
                )}

                <div className="absolute inset-0 p-6 flex flex-col justify-end z-10 bg-gradient-to-t from-black/75 via-black/15 to-transparent">
                  <h3 className="font-display text-xl md:text-3xl lg:text-4xl font-bold text-white uppercase leading-none group-hover:-translate-y-2 transition-transform duration-300">
                    {industry.name}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


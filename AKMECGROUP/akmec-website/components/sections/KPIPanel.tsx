'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { stats } from '../../data/stats';
import { MetalPanel } from '../effects/MetalPanel';

export function KPIPanel() {
  return (
    <section className="py-20 bg-[var(--color-steel-950)] relative z-20 -mt-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <MetalPanel className="relative p-8 md:p-12 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
          
          {/* Screws */}
          <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 shadow-inner flex items-center justify-center border border-gray-400">
            <div className="w-full h-0.5 bg-gray-600/50 rotate-45"></div>
          </div>
          <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 shadow-inner flex items-center justify-center border border-gray-400">
            <div className="w-full h-0.5 bg-gray-600/50 -rotate-12"></div>
          </div>
          <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 shadow-inner flex items-center justify-center border border-gray-400">
            <div className="w-full h-0.5 bg-gray-600/50 rotate-90"></div>
          </div>
          <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 shadow-inner flex items-center justify-center border border-gray-400">
            <div className="w-full h-0.5 bg-gray-600/50 rotate-180"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 relative z-10">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Recessed Screen */}
                <div className="w-full bg-[#0a1118] rounded-md p-4 shadow-[inset_0_4px_10px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.4)] border border-black/40 mb-4 relative overflow-hidden">
                  {/* Digital Glow */}
                  <div className="absolute inset-0 bg-[var(--color-signal)]/5 mix-blend-screen pointer-events-none"></div>
                  
                  <div className="h-10 w-10 mx-auto mb-3 opacity-70 group-hover:opacity-100 transition-opacity">
                    <Image 
                      src={stat.icon} 
                      alt="" 
                      width={40} 
                      height={40} 
                      className="object-contain filter invert"
                    />
                  </div>
                  <div className="font-mono text-3xl md:text-4xl font-bold text-[var(--color-signal)] drop-shadow-[0_0_8px_rgba(0,194,168,0.6)]">
                    {stat.value}
                  </div>
                </div>
                
                {/* Engraved Label */}
                <h4 className="text-xs md:text-sm font-display uppercase tracking-widest text-slate-700 font-bold mix-blend-color-burn">
                  {stat.label}
                </h4>
              </motion.div>
            ))}
          </div>
        </MetalPanel>
      </div>
    </section>
  );
}


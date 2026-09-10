'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { clients } from '../../data/clients';

export function ClientLogos() {
  const approvals = [
    'ARAMCO (PID, VID, QM approved)',
    'SABIC',
    'ADNOC',
    'ORPIC',
    'FLUOR',
    'Chevron'
  ];

  return (
    <section className="py-24 bg-[var(--color-steel-100)]">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Approved / Registered With Banner */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-safety)]/10 text-[var(--color-safety)] font-mono text-xs font-bold uppercase tracking-widest mb-4">
            Authorized Inspection & Quality Partner
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-[var(--color-steel-950)] mb-6">
            Approved / Registered With
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-3 max-w-4xl mx-auto">
            {approvals.map((approval, idx) => (
              <span 
                key={idx} 
                className="px-4 py-2 bg-white rounded-lg border border-[var(--color-steel-300)]/40 text-xs md:text-sm font-mono font-bold text-[var(--color-steel-800)] shadow-sm"
              >
                {approval}
              </span>
            ))}
          </div>
        </div>

        <div className="text-center mb-12 pt-6 border-t border-[var(--color-steel-300)]/30">
          <h3 className="text-3xl md:text-5xl font-display font-bold text-[var(--color-steel-950)] mb-4">
            Trusted By Industry Leaders
          </h3>
          <p className="text-[var(--color-steel-600)] text-lg max-w-2xl mx-auto">
            Delivering uncompromised quality and reliability to major industrial operators worldwide.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {clients.map((client, i) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (i % 6) * 0.1, duration: 0.4 }}
              className="bg-white rounded-xl p-6 flex items-center justify-center aspect-[3/2] shadow-sm hover:shadow-md transition-shadow group border border-[var(--color-steel-300)]/30"
            >
              <div className="relative w-full h-full">
                <Image
                  src={client.logo}
                  alt={client.name}
                  fill
                  className="object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
              {client.isUnknown && (
                <span className="sr-only">Client logo (Name to be confirmed)</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

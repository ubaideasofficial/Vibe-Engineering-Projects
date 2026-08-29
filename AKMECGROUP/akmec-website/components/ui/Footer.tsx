'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { navigation } from '../../data/navigation';
import type { NavMenu } from '../../data/navigation';
import { offices } from '../../data/offices';

function BrandLogo({ className = '' }: { className?: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`flex items-center justify-center text-2xl font-black tracking-[-0.08em] text-white ${className}`} aria-label="AKMEC logo">
        AKMEC
      </div>
    );
  }

  return (
    <Image
      src="/media/brand/akmec-logo-web.png"
      alt="AKMEC Logo"
      fill
      sizes="(max-width: 1024px) 160px, 200px"
      onError={() => setHasError(true)}
      className={`object-contain object-left ${className}`}
    />
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const registeredOffice = offices.find(o => o.id === 'registered-nashik');

  return (
    <footer className="bg-[var(--color-steel-950)] border-t border-white/10 pt-20 pb-10 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-6">
            <div className="relative w-full max-w-[15rem]">
              <Image
                src="/media/brand/akmec-logo-web.png"
                alt="AKMEC logo"
                width={760}
                height={240}
                className="h-auto w-full object-contain object-left"
              />
            </div>
            <p className="text-[var(--color-steel-300)] text-sm max-w-sm leading-relaxed">
              AKMEC delivers complete industrial solutions — Inspection, Audit, Testing, Asset Integrity, Technical Solutions, Manpower Outsourcing & Training.
            </p>
            <div className="pt-2">
              <a href="/media/Company Profile_AKMEC LLP.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-bold text-[var(--color-safety)] hover:text-orange-400 transition-colors">
                Download Company Profile
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-display uppercase tracking-wider text-sm mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {navigation.map((item, idx) => {
                if (!('items' in item)) {
                  return (
                    <li key={idx}>
                      <Link href={item.href} className="text-[var(--color-steel-300)] hover:text-white text-sm transition-colors">
                        {item.title}
                      </Link>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-display uppercase tracking-wider text-sm mb-6">Services</h4>
            <ul className="space-y-3">
              {(() => {
                const servicesMenu = navigation.find((n): n is any => n.title === 'Services' && 'items' in n);
                if (!servicesMenu) return null;
                return servicesMenu.items.map((item: any, idx: number) => (
                  <li key={idx}>
                    <Link href={item.href} className="text-[var(--color-steel-300)] hover:text-white text-sm transition-colors">
                      {item.title}
                    </Link>
                  </li>
                ));
              })()}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-display uppercase tracking-wider text-sm mb-6">Contact Us</h4>
            <div className="space-y-4">
              {registeredOffice && (
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-[var(--color-steel-300)] mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-[var(--color-steel-300)] text-sm leading-relaxed">{registeredOffice.address}</span>
                </div>
              )}
              <div className="flex items-center">
                <svg className="w-5 h-5 text-[var(--color-steel-300)] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:inquiry@akmecgroup.com" className="text-[var(--color-steel-300)] hover:text-white text-sm transition-colors">inquiry@akmecgroup.com</a>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-[var(--color-steel-300)] mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="flex flex-col">
                  <a href="tel:+919226112227" className="text-[var(--color-steel-300)] hover:text-white text-sm transition-colors">+91 9226112227</a>
                  <a href="tel:+919920702095" className="text-[var(--color-steel-300)] hover:text-white text-sm transition-colors">+91 9920702095</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between">
          <p className="text-[var(--color-steel-300)] text-sm mb-4 md:mb-0">
            © {currentYear} AKMEC LLP. All rights reserved. ISO 9001:2015 certified.
          </p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="text-[var(--color-steel-300)] hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[var(--color-steel-300)] hover:text-white text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


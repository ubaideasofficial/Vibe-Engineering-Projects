'use client';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();

  const yBg = useTransform(scrollY, [0, 1000], [0, 250]);
  const yMid = useTransform(scrollY, [0, 1000], [0, -100]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const x = (e.clientX / clientWidth - 0.5) * 20;
    const y = (e.clientY / clientHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[var(--color-steel-950)]"
    >
      {/* Background Layer: heavily darkened and blurred offshore platform */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: yBg }}
      >
        <Image 
          src="/media/hero/offshore-platform-aerial.jpg"
          alt="Offshore Platform"
          fill
          className="object-cover opacity-25 blur-sm"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-steel-950)]/50 via-transparent to-[var(--color-steel-950)]" />
      </motion.div>

      {/* Mid Layer: Animated Wireframe Pipeline SVG */}
      <motion.div 
        className="absolute inset-0 z-10 flex items-center justify-center opacity-30 pointer-events-none"
        style={{ 
          y: yMid,
          x: mousePos.x * -0.5,
          rotateX: mousePos.y * -0.2,
          rotateY: mousePos.x * 0.2
        }}
      >
        <svg viewBox="0 0 1200 800" fill="none" className="w-full max-w-5xl h-auto stroke-[var(--color-steel-300)] stroke-[1.5]">
          <motion.path 
            d="M 100 700 L 100 400 L 400 400 L 400 200 L 800 200 L 800 500 L 1100 500" 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          <motion.circle cx="100" cy="400" r="12" fill="var(--color-steel-950)" />
          <motion.circle cx="400" cy="400" r="12" fill="var(--color-steel-950)" />
          <motion.circle cx="400" cy="200" r="12" fill="var(--color-steel-950)" />
          <motion.circle cx="800" cy="200" r="12" fill="var(--color-steel-950)" />
          <motion.circle cx="800" cy="500" r="12" fill="var(--color-steel-950)" />
        </svg>
      </motion.div>

      {/* Foreground Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          <motion.div 
            className="flex-1 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
              <span className="text-white">Empowering Industries with</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-safety)] to-orange-400">Quality & Trust</span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--color-steel-300)] mb-10 max-w-2xl leading-relaxed">
              End-to-end industrial solutions ensuring safety, compliance, and excellence across every project phase.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Link 
                href="/contact" 
                className="inline-flex items-center px-8 py-4 bg-[var(--color-safety)] hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,106,0,0.3)] hover:shadow-[0_0_30px_rgba(255,106,0,0.5)] transform hover:-translate-y-0.5"
              >
                Request an Inspection
              </Link>
              <a 
                href="/media/Company Profile_AKMEC LLP.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="liquid inline-flex items-center px-8 py-4 text-white font-bold rounded-xl transition-all hover:bg-white/10"
              >
                Download Profile
              </a>
            </div>
          </motion.div>

          {/* Floating Stat Pods (Liquid Glass) */}
          <div className="hidden lg:flex flex-col gap-6 relative" style={{ perspective: '1000px' }}>
            <motion.div 
              className="liquid rounded-2xl p-6 w-64 backdrop-blur-xl border border-white/10"
              style={{ x: mousePos.x, y: mousePos.y }}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <div className="text-4xl font-display font-bold text-white mb-1">50+</div>
              <div className="text-sm font-medium text-[var(--color-steel-300)] uppercase tracking-wider">Competent Inspectors</div>
            </motion.div>

            <motion.div 
              className="liquid rounded-2xl p-6 w-64 backdrop-blur-xl border border-white/10 ml-12"
              style={{ x: mousePos.x * 1.5, y: mousePos.y * 1.5 }}
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            >
              <div className="text-4xl font-display font-bold text-white mb-1">100+</div>
              <div className="text-sm font-medium text-[var(--color-steel-300)] uppercase tracking-wider">Successful Projects</div>
            </motion.div>

            <motion.div 
              className="liquid rounded-2xl p-6 w-64 backdrop-blur-xl border border-white/10"
              style={{ x: mousePos.x * 0.8, y: mousePos.y * 0.8 }}
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }}
            >
              <div className="text-4xl font-display font-bold text-white mb-1">5+</div>
              <div className="text-sm font-medium text-[var(--color-steel-300)] uppercase tracking-wider">Years Experience</div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

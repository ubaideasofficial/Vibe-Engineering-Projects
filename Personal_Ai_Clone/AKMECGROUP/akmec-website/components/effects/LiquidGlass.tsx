'use client';
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
}

export function LiquidGlass({ children, className = '', interactive = false, ...props }: LiquidGlassProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !interactive) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    if (interactive) setOpacity(1);
  };

  const handleMouseLeave = () => {
    if (interactive) setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`liquid rounded-full ${className}`}
      {...props}
    >
      {interactive && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition duration-300"
          animate={{ opacity }}
          style={{
            background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.15), transparent 40%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}

import React from 'react';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  dark?: boolean;
}

export function GlassPanel({ children, className = '', dark = false, ...props }: GlassPanelProps) {
  const baseClass = dark ? 'glass-dark' : 'glass';
  return (
    <div className={`${baseClass} rounded-2xl ${className}`} {...props}>
      {children}
    </div>
  );
}

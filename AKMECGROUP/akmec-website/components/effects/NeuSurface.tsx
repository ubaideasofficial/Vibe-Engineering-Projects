import React from 'react';

interface NeuSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  inset?: boolean;
}

export function NeuSurface({ children, className = '', inset = false, ...props }: NeuSurfaceProps) {
  const shadowClass = inset ? 'neu-inset' : 'neu-raised';
  return (
    <div className={`bg-[var(--color-steel-100)] rounded-xl ${shadowClass} ${className}`} {...props}>
      {children}
    </div>
  );
}


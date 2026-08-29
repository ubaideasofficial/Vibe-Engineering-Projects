import React from 'react';

interface MetalPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function MetalPanel({ children, className = '', ...props }: MetalPanelProps) {
  return (
    <div className={`metal rounded-xl text-slate-800 ${className}`} {...props}>
      {children}
    </div>
  );
}


import React from 'react';

interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ClayCard({ children, className = '', ...props }: ClayCardProps) {
  return (
    <div className={`clay text-slate-800 ${className}`} {...props}>
      {children}
    </div>
  );
}


import React from 'react';

interface BrutalBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function BrutalBox({ children, className = '', ...props }: BrutalBoxProps) {
  return (
    <div className={`brutal ${className}`} {...props}>
      {children}
    </div>
  );
}


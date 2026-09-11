import React from 'react';
import { GlassPanel } from '../effects/GlassPanel';

export function SetupNotice() {
  return (
    <div className="container mx-auto px-4 max-w-2xl relative z-10">
      <GlassPanel dark={true} className="p-10 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Careers Portal Coming Online Soon</h2>
        <p className="text-[var(--color-steel-300)]">
          We&apos;re finishing setup on our candidate portal. In the meantime, please email your CV to{' '}
          <a href="mailto:inquiry@akmecgroup.com" className="text-[var(--color-safety)] font-bold hover:text-orange-400 transition-colors">
            inquiry@akmecgroup.com
          </a>
          .
        </p>
      </GlassPanel>
    </div>
  );
}

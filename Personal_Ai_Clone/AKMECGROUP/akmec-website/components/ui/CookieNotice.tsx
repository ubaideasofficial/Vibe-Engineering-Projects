'use client';

import { useEffect, useState } from 'react';

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('akmec-cookie-consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('akmec-cookie-consent', 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4">
      <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-[rgba(17,23,34,0.8)] px-5 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <p className="text-base font-medium text-white">
              We use cookies to improve your browsing experience and understand how our site is used.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-[var(--color-steel-200)] transition hover:border-white/30 hover:text-white"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={accept}
              className="rounded-full bg-[var(--color-safety)] px-5 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

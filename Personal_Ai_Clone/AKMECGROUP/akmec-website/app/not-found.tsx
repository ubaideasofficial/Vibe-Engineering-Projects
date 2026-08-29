import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[var(--color-steel-950)] px-4 py-20">
      <div className="max-w-2xl border-[3px] border-black bg-white p-8 text-center shadow-[10px_10px_0_#000] md:p-14">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-[var(--color-safety)]">404</p>
        <h1 className="font-display text-5xl font-black uppercase tracking-[-0.05em] text-black md:text-7xl">Page not found</h1>
        <p className="mt-6 text-lg text-[var(--color-steel-700)]">
          The page you requested is not available or may have moved.
        </p>
        <Link href="/" className="mt-8 inline-flex items-center justify-center bg-[var(--color-safety)] px-8 py-4 text-base font-bold uppercase text-white transition hover:bg-orange-600">
          Back to home
        </Link>
      </div>
    </div>
  );
}

import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | AKMEC LLP',
  description: 'AKMEC LLP website terms of use and service conditions.',
};

export default function TermsPage() {
  return (
    <div className="bg-[var(--color-steel-050)] pt-24 pb-20 text-[var(--color-steel-900)]">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-safety)]">Legal</p>
          <h1 className="font-display text-4xl font-bold md:text-6xl">Terms of Service</h1>
        </div>

        <div className="space-y-8 rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_45px_rgba(20,30,50,0.08)] md:p-12">
          <section>
            <h2 className="mb-3 font-display text-2xl font-bold">Website usage</h2>
            <p className="text-base leading-7 text-[var(--color-steel-700)]">
              This website is provided for informational purposes only. The content may change without notice. AKMEC LLP
              reserves the right to update, modify, or remove any information at any time.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold">Service enquiries</h2>
            <p className="text-base leading-7 text-[var(--color-steel-700)]">
              Any enquiry submitted through this site is treated as a request for information and does not create a binding
              contract until both parties confirm the scope, commercial terms, and execution plan.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold">Intellectual property</h2>
            <p className="text-base leading-7 text-[var(--color-steel-700)]">
              All content on this website, including text, graphics, and branding, remains the property of AKMEC LLP unless
              otherwise stated. Reproduction without permission is prohibited.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold">Liability</h2>
            <p className="text-base leading-7 text-[var(--color-steel-700)]">
              AKMEC LLP strives to ensure the accuracy of website content, but makes no warranty regarding completeness,
              reliability, or suitability for any particular purpose.
            </p>
          </section>
        </div>

        <div className="mt-8 text-sm text-[var(--color-steel-600)]">
          <Link href="/" className="font-semibold text-[var(--color-safety)] hover:text-orange-600">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

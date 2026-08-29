import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | AKMEC LLP',
  description: 'AKMEC privacy policy covering website use, cookies, and how contact information is handled.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-[var(--color-steel-050)] pt-24 pb-20 text-[var(--color-steel-900)]">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-safety)]">Legal</p>
          <h1 className="font-display text-4xl font-bold md:text-6xl">Privacy Policy</h1>
        </div>

        <div className="space-y-8 rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_45px_rgba(20,30,50,0.08)] md:p-12">
          <section>
            <h2 className="mb-3 font-display text-2xl font-bold">Information we collect</h2>
            <p className="text-base leading-7 text-[var(--color-steel-700)]">
              AKMEC LLP may collect information you provide through contact forms, quote requests, and email enquiries.
              This may include your name, company, phone number, email address, and project requirements.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold">How we use it</h2>
            <p className="text-base leading-7 text-[var(--color-steel-700)]">
              We use this information to respond to enquiries, evaluate inspection or engineering requirements, and provide
              the services requested. We do not sell personal data.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold">Cookies</h2>
            <p className="text-base leading-7 text-[var(--color-steel-700)]">
              We use cookies to improve site performance, remember preferences, and measure general website usage. You may
              disable cookies in your browser, but some features may not work as intended.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl font-bold">Contact</h2>
            <p className="text-base leading-7 text-[var(--color-steel-700)]">
              If you have questions about this policy, contact us at inquiry@akmecgroup.com or call +91 9226112227.
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

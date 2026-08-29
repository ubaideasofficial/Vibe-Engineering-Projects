import type { Metadata } from "next";
import { Header } from "../components/ui/Header";
import { Footer } from "../components/ui/Footer";
import { CookieNotice } from "../components/ui/CookieNotice";
import "./globals.css";

export const metadata: Metadata = {
  title: "AKMEC LLP | Empowering Industries with Quality & Trust",
  description: "AKMEC delivers complete industrial solutions — Inspection, Audit, Testing, Asset Integrity, Technical Solutions, Manpower Outsourcing & Training.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth antialiased">
      <body className="min-h-screen flex flex-col bg-[var(--color-steel-950)] text-[var(--color-steel-100)] font-body" suppressHydrationWarning>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-[var(--color-safety)] focus:text-white">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-grow pt-24">
          {children}
        </main>
        <Footer />
        <CookieNotice />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "AKMEC LLP",
              "url": "https://www.akmecgroup.com",
              "logo": "https://www.akmecgroup.com/media/brand/akmec-logo-web.png",
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+91-9226112227",
                  "contactType": "customer service"
                }
              ]
            })
          }}
        />
      </body>
    </html>
  );
}

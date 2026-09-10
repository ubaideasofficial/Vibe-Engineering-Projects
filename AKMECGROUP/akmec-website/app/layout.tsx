import type { Metadata } from "next";
import { Header } from "../components/ui/Header";
import { Footer } from "../components/ui/Footer";
import { CookieNotice } from "../components/ui/CookieNotice";
import { AKMECAssistant } from "../components/ui/AKMECAssistant";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.akmecgroup.com"),
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
        <AKMECAssistant />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.akmecgroup.com/#organization",
                  "name": "AKMEC LLP",
                  "legalName": "AKMEC LLP",
                  "alternateName": ["AKMEC", "AKMEC GROUP"],
                  "url": "https://www.akmecgroup.com",
                  "logo": "https://www.akmecgroup.com/media/brand/akmec-logo-web.png",
                  "email": "inquiry@akmecgroup.com",
                  "telephone": "+91-9226112227",
                  "description": "Complete industrial solutions: Inspection, Audit, Testing, Asset Integrity, Technical Solutions, Manpower Outsourcing & Training",
                  "award": "ISO 9001:2015",
                  "contactPoint": [
                    {
                      "@type": "ContactPoint",
                      "telephone": "+91-9226112227",
                      "contactType": "customer service",
                      "email": "inquiry@akmecgroup.com"
                    },
                    {
                      "@type": "ContactPoint",
                      "telephone": "+91-9920702095",
                      "contactType": "technical support",
                      "email": "inquiry@akmecgroup.com"
                    }
                  ]
                },
                {
                  "@type": "LocalBusiness",
                  "@id": "https://www.akmecgroup.com/#nashik-office",
                  "name": "AKMEC LLP - Registered Office",
                  "parentOrganization": { "@id": "https://www.akmecgroup.com/#organization" },
                  "telephone": "+91-9226112227",
                  "email": "inquiry@akmecgroup.com",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "AKMEC Workshop, Gate No. 1, Plot No. 45, Survey No. 104/2/A, Malegaon",
                    "addressLocality": "Nashik",
                    "addressRegion": "Maharashtra",
                    "postalCode": "423203",
                    "addressCountry": "IN"
                  }
                },
                {
                  "@type": "LocalBusiness",
                  "@id": "https://www.akmecgroup.com/#vadodara-office",
                  "name": "AKMEC LLP - Operational Office",
                  "parentOrganization": { "@id": "https://www.akmecgroup.com/#organization" },
                  "telephone": "+91-9226112227",
                  "email": "inquiry@akmecgroup.com",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "309 Siddharth Magnum Plus, Dhanteshwar Ring Road",
                    "addressLocality": "Vadodara",
                    "addressRegion": "Gujarat",
                    "postalCode": "390004",
                    "addressCountry": "IN"
                  }
                },
                {
                  "@type": "LocalBusiness",
                  "@id": "https://www.akmecgroup.com/#mumbai-office",
                  "name": "AKMEC LLP - Mumbai Branch",
                  "parentOrganization": { "@id": "https://www.akmecgroup.com/#organization" },
                  "telephone": "+91-9226112227",
                  "email": "inquiry@akmecgroup.com",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Gala 180B, Kurla Scrap Merchant Ass., Mankhurd Mandala, G M Link Road",
                    "addressLocality": "Mumbai",
                    "addressRegion": "Maharashtra",
                    "postalCode": "400043",
                    "addressCountry": "IN"
                  }
                },
                {
                  "@type": "LocalBusiness",
                  "@id": "https://www.akmecgroup.com/#jubail-office",
                  "name": "AKMEC / Masar NDTS - Overseas Office",
                  "parentOrganization": { "@id": "https://www.akmecgroup.com/#organization" },
                  "email": "sales@masarNDT.com",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Masar NDTS Operation & Maintenance, Building No. 4258, Al Safat Dist., Al-Jubail City Centre",
                    "addressLocality": "Al-Jubail",
                    "postalCode": "35514",
                    "addressCountry": "SA"
                  }
                },
                {
                  "@type": "Service",
                  "serviceType": "Inspection & Audit",
                  "provider": { "@id": "https://www.akmecgroup.com/#organization" },
                  "name": "Industrial Inspection & Quality Auditing Services",
                  "description": "Second and third party inspection, source inspection, expediting, shutdown inspection and QA/QC."
                },
                {
                  "@type": "Service",
                  "serviceType": "Non-Destructive Testing (NDT)",
                  "provider": { "@id": "https://www.akmecgroup.com/#organization" },
                  "name": "Examination & Testing (NDT Services)",
                  "description": "Conventional and advanced NDT including PAUT, TOFD, Eddy Current, UT, and Heat Treatment."
                },
                {
                  "@type": "Service",
                  "serviceType": "Asset Integrity & Engineering",
                  "provider": { "@id": "https://www.akmecgroup.com/#organization" },
                  "name": "Asset Integrity Management & Engineering Solutions",
                  "description": "RBI, Fitness for Service (API 579), Corrosion loop, remaining life assessment and failure analysis."
                }
              ]
            })
          }}
        />
      </body>
    </html>
  );
}

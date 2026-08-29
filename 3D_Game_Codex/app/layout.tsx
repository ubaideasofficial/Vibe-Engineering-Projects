import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Neon Hover Runner", description: "A neon three-lane runner." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neon Hover Runner | 3D Cyberpunk Endless Game",
  description:
    "High-speed 3D Cyberpunk hoverboard endless runner built with Next.js, React Three Fiber, WebGL, and Google Antigravity.",
  keywords: [
    "3D Game",
    "Endless Runner",
    "React Three Fiber",
    "Three.js",
    "Cyberpunk",
    "Next.js",
    "Antigravity",
  ],
  authors: [{ name: "Ubaid Ideas / Antigravity" }],
  openGraph: {
    title: "Neon Hover Runner | 3D Cyberpunk Game",
    description: "Dodge obstacles, collect energy orbs, and compete on the global leaderboard.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#050714",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050714] text-white antialiased overflow-hidden h-screen w-screen">
        {children}
      </body>
    </html>
  );
}

import "./globals.css";

export const metadata = {
  title: "MCP Forge",
  description: "Turn a public website into a queryable MCP server."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
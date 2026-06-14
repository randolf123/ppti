import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PPTI Academic",
  description: "Platform Manajemen Akademik PPTI",
  manifest: "/manifest.json",
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

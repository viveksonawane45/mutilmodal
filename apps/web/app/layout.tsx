import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DisasterScope",
  description: "AI-powered multimodal disaster management platform",
  manifest: "/manifest.json"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

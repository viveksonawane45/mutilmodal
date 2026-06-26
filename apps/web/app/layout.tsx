import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DisasterScope",
  description: "AI-powered multimodal disaster management platform",
  manifest: "/manifest.json"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('disasterscope-theme');
                if (theme === 'light' || (!theme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            })();
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

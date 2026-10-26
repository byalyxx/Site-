import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@/components/analytics";
import { THEME_TEST_SCRIPT } from "@/components/theme-test";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

import { SITE_URL } from "@/lib/metadata";

// Site-wide defaults. Each page sets its own title, description and canonical URL with pageMetadata().
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <head>
        {/* Light/dark A/B test: picks a first-time visitor's starting theme before anything paints */}
        <script dangerouslySetInnerHTML={{ __html: THEME_TEST_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

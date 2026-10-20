import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { profile } from "@/content/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://alyxx.com"),
  title: `${profile.name} | ${profile.tagline}`,
  description: "Videos, the gear I use, and the brands I partner with.",
  openGraph: {
    title: profile.name,
    description: profile.tagline,
    url: "https://alyxx.com",
    images: [profile.avatar],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

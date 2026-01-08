import type { Metadata } from "next";
import { DM_Sans, Newsreader } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BookmarksProvider } from "@/components/BookmarksProvider";
import { SessionProvider } from "@/components/SessionProvider";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  title: "New Media Map | Discover Emerging Web3 Voices",
  description:
    "A living map of emerging Web3 voices, curated by signal and contribution, not followers, hype, or conference presence.",
  openGraph: {
    title: "New Media Map",
    description: "Discover emerging Web3 voices by signal and contribution",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${newsreader.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <SessionProvider>
          <ThemeProvider>
            <BookmarksProvider>
              {children}
            </BookmarksProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

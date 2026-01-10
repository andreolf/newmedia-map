import type { Metadata } from "next";
import { Space_Grotesk, Syne } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BookmarksProvider } from "@/components/BookmarksProvider";
import { SessionProvider } from "@/components/SessionProvider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
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
    <html lang="en" className={`${spaceGrotesk.variable} ${syne.variable} dark`} suppressHydrationWarning>
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

import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "STEM x TEB Technikum",
    template: "%s | STEM x TEB Technikum",
  },
  description:
    "Koło technologiczne STEM przy TEB Technikum w Warszawie. Robotyka, mechatronika, programowanie — tworzymy przyszłość.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://stem.pl"),
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "STEM x TEB Technikum",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
        {children}
      </body>
    </html>
  );
}

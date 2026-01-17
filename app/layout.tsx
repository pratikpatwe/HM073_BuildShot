import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Kairos - Act at the Right Moment",
  description: "Kairos is an AI-powered life management platform that brings your finances, habits, and mental well-being into one intelligent system. Track what matters, understand your patterns, and make better daily decisions.",
  keywords: ["AI", "life management", "finance tracking", "habit tracker", "mental well-being", "productivity", "personal growth"],
  authors: [{ name: "Kairos Team" }],
  openGraph: {
    title: "Kairos - Act at the Right Moment",
    description: "AI-powered life management for finances, habits, and well-being.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0B0B0B] text-white`}
      >
        {children}
      </body>
    </html>
  );
}

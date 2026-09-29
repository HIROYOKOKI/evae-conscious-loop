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
  title: "EVΛƎ Conscious Loop — structure AI decisions before execution",
  description:
    "Open-source (MIT) TypeScript library: Intent → Possibility → Decision Boundary → Trace. Try it in the playground.",
  metadataBase: new URL("https://evae-conscious-loop.vercel.app"),
  openGraph: {
    title: "EVΛƎ Conscious Loop",
    description: "Structure an AI decision before execution and keep the reason as a trace. MIT licensed.",
    url: "https://evae-conscious-loop.vercel.app",
    siteName: "EVΛƎ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

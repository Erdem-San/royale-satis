import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { CartProvider } from "@/contexts/CartContext";
import ProgressBar from "@/components/ProgressBar";
import { headers } from "next/headers";
import "./globals.css";
import "./nprogress.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Royale Satış - Oyun Item ve Yang Satış Platformu",
  description: "Metin2 ve Royale Online için güvenilir item ve yang satış platformu",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased min-h-screen flex flex-col bg-[#1a1b1e]`}>
        <CartProvider>
          <ProgressBar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

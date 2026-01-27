import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { CartProvider } from "@/contexts/CartContext";
import ProgressBar from "@/components/ProgressBar";
import { headers } from "next/headers";
import "./globals.css";
import "./nprogress.css";
import "quill/dist/quill.snow.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Diopazar - Oyun Item ve Yang Satış Platformu",
  description: "Metin2 ve Royale Online için güvenilir item ve yang satış platformu",
};

const outfit = Outfit({
  variable: "--font-outfit",
  display: "swap",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased min-h-screen flex flex-col bg-[#1a1b1e]`}>
        <CartProvider>
          <ProgressBar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

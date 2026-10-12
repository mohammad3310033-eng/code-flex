import type { Metadata } from "next";
import { Geist, Noto_Sans_Arabic } from "next/font/google";

import "../globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const notoSansArabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-noto-arabic", display: "swap", preload: false });

export const metadata: Metadata = {
  title: "Code Flex Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${geist.variable} ${notoSansArabic.variable}`}>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";

// Modern Arabic-first typeface.
const appFont = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ابن سينا — Avicena",
  description: "منصة رعاية صحية عن بُعد — احجز، استشر، وتابع تقاريرك الطبية.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Arabic-first, RTL by default.
  return (
    <html lang="ar" dir="rtl" className={appFont.variable}>
      <head>
        {/* Material Symbols icons used by the Clinical Clarity design */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="bg-background font-sans text-on-surface antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

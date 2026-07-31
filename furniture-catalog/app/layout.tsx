import type { Metadata } from "next";
import { Bitter, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Bitter({
  variable: "--font-fraunces",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const worksans = Manrope({
  variable: "--font-worksans",
  subsets: ["latin", "cyrillic"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Мебельная мастерская — каталог",
  description: "Каталог мебели ручной работы: столы, стулья, шкафы и другая мебель на заказ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${fraunces.variable} ${worksans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bone text-ink">{children}</body>
    </html>
  );
}

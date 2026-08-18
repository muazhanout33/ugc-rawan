import type { Metadata } from "next";
import { Sora, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { SITE_META } from "@/lib/constants";
import { CustomCursor } from "@/components/animations";
import { VideoProvider } from "@/components/video/VideoContext";
import StructuredData from "@/components/seo/StructuredData";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE_META.title,
  description: SITE_META.description,
  keywords: SITE_META.keywords,
  authors: [{ name: "Rewan Abdrabou" }],
  creator: "Rewan Abdrabou",
  metadataBase: new URL(SITE_META.url),
  alternates: {
    canonical: SITE_META.url,
  },
  openGraph: {
    title: SITE_META.title,
    description: SITE_META.description,
    url: SITE_META.url,
    siteName: "Rewan Abdrabou Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rewan Abdrabou — UGC Creator & Videographer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_META.title,
    description: SITE_META.description,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-[#0F0A19] text-white overflow-x-hidden">
        <VideoProvider>
          <StructuredData />
          <CustomCursor />
          {/* Noise texture overlay */}
          <div className="noise-overlay" aria-hidden="true" />
          {children}
        </VideoProvider>
      </body>
    </html>
  );
}

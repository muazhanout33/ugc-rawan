/**
 * About page — dedicated route for About content.
 */

import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import About from "@/components/sections/About";
import Footer from "@/components/layout/Footer";
import LenisProvider from "@/components/layout/LenisProvider";
import { SITE_META } from "@/lib/constants";

export const metadata: Metadata = {
  title: `About — ${SITE_META.name}`,
  description: SITE_META.description,
  openGraph: {
    title: `About — ${SITE_META.name}`,
    description: SITE_META.description,
    url: `${SITE_META.url}/about`,
    siteName: "Rewan Abdrabou Portfolio",
    type: "website",
    locale: "en_US",
  },
};

export default function AboutPage() {
  return (
    <>
      <LenisProvider />
      <Navbar />
      <main className="flex flex-col min-h-screen pt-20">
        <About />
      </main>
      <Footer />
    </>
  );
}

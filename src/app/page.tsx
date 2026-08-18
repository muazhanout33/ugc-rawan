/**
 * Root page — SERVER COMPONENT.
 */

import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import TrustedBy from "@/components/sections/Clients";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import LenisProvider from "@/components/layout/LenisProvider";

/* Heavy media sections dynamically imported to defer chunk loading */
const Portfolio = dynamic(() => import("@/components/sections/Portfolio"));
const InstagramFeed = dynamic(() => import("@/components/sections/InstagramFeed"));

export default function Home() {
  return (
    <>
      <LenisProvider />
      <Navbar />
      <main className="flex flex-col min-h-screen">
        <Hero />
        <TrustedBy />
        <Portfolio />
        <InstagramFeed />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

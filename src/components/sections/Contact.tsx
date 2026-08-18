"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Heart } from "lucide-react";
import Link from "next/link";
import { NAV_LINKS, SITE_META } from "@/lib/constants";
import { ScrollReveal } from "@/components/animations";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Contact() {
  return (
    <section id="contact" className="relative bg-[#0F0A19] overflow-hidden">
      <div className="gradient-line" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#C4B5FD] rounded-full blur-[200px] opacity-[0.02] pointer-events-none" />

      <div className="section-container py-20 lg:py-28">
        {/* ── Main 3-Column Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 lg:gap-12 mb-16 lg:mb-20">
          {/* ── Column 1: Identity & Passion ── */}
          <ScrollReveal animation="fadeUp" delay={0}>
            <div>
              <h2 className="font-inter font-extrabold text-white text-[30px] sm:text-[34px] leading-tight tracking-tight mb-4">
                Rewan Abdrabou
              </h2>
              <p className="font-inter text-white/55 text-[16px] sm:text-[17px] leading-relaxed max-w-[320px]">
                {SITE_META.description}
              </p>
            </div>
          </ScrollReveal>

          {/* ── Column 2: Navigation & Location ── */}
          <ScrollReveal animation="fadeUp" delay={0.1}>
            <div className="flex flex-col gap-8">
              <div>
                <p className="font-inter text-white/35 text-[14px] font-normal uppercase tracking-[0.14em] mb-4">
                  Navigate
                </p>
                <ul className="space-y-2.5">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      {link.href.startsWith("/") ? (
                        <Link
                          href={link.href}
                          className="font-inter text-white/60 hover:text-white text-[16px] font-medium transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className="font-inter text-white/60 hover:text-white text-[16px] font-medium transition-colors duration-200"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="flex items-center gap-2.5 font-inter text-white/50 text-[16px] font-medium">
                  <span className="text-[#C4B5FD]">📍</span>
                  Shebeen El-Kom, Egypt
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Column 3: Direct Contact ── */}
          <ScrollReveal animation="fadeUp" delay={0.2}>
            <div className="flex flex-col gap-5">
              <a
                href={`mailto:${SITE_META.email}`}
                className="font-inter text-white/60 hover:text-white text-[16px] font-medium transition-colors duration-200 flex items-center gap-3"
              >
                <Mail size={16} className="text-[#C4B5FD] flex-shrink-0" />
                {SITE_META.email}
              </a>

              <a
                href="tel:+201040217670"
                className="font-inter text-white font-semibold text-[16px] transition-colors duration-200 flex items-center gap-3 underline underline-offset-4 decoration-white/20 hover:text-[#C4B5FD] hover:decoration-[#C4B5FD]/40"
              >
                <Phone size={16} className="text-[#C4B5FD] flex-shrink-0" />
                +20 10 40217670
              </a>

              <a
                href={SITE_META.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-inter text-white/60 hover:text-white text-[16px] font-medium transition-colors duration-200 flex items-center gap-3"
              >
                <span className="text-[#E9D5FF] flex-shrink-0">
                  <InstagramIcon />
                </span>
                @rewanabdrabou
              </a>

              {/* ── DM on Instagram CTA ── */}
              <motion.a
                href="https://www.instagram.com/rewan__reel__ugc_creator/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#1A0F2E] border border-[rgba(196,181,253,0.35)] text-white font-inter text-[15px] font-semibold shadow-[0_0_24px_rgba(196,181,253,0.15)] transition-all duration-300 hover:bg-[#211540] hover:border-[rgba(196,181,253,0.55)] hover:shadow-[0_0_36px_rgba(196,181,253,0.25)] self-start"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <InstagramIcon />
                DM on Instagram
              </motion.a>
            </div>
          </ScrollReveal>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="gradient-line" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
          <p className="font-inter text-white/25 text-[13px]">
            © {new Date().getFullYear()} Rewan Abdrabou. All rights reserved.
          </p>
          <p className="font-inter text-white/20 text-[12px] flex items-center gap-1.5">
            Made with <Heart size={10} className="text-[#E9D5FF]" /> in Shebeen El-Kom, Egypt
          </p>
        </div>
      </div>
    </section>
  );
}

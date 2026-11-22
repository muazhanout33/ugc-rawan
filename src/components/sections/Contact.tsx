"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Heart } from "lucide-react";
import Link from "next/link";
import { NAV_LINKS, SITE_META } from "@/lib/constants";
import { ScrollReveal } from "@/components/animations";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Contact() {
  return (
    <section id="contact" className="relative bg-[#141112] overflow-hidden border-t border-[#443337]">
      <div className="section-container py-20 lg:py-28">
        {/* ── Main 3-Column Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 lg:gap-12 mb-16 lg:mb-20">
          {/* ── Column 1: Identity & Passion ── */}
          <ScrollReveal animation="fadeUp" delay={0}>
            <div>
              <h2 className="font-serif text-[#F4EDE8] text-[28px] sm:text-[34px] font-normal leading-tight tracking-tight mb-4">
                Rewan Abdrabou
              </h2>
              <p className="font-inter text-[#B9ADAA] text-[15px] sm:text-[16px] leading-relaxed max-w-[320px]">
                {SITE_META.description}
              </p>
            </div>
          </ScrollReveal>

          {/* ── Column 2: Navigation & Location ── */}
          <ScrollReveal animation="fadeUp" delay={0.1}>
            <div className="flex flex-col gap-8">
              <div>
                <p className="font-inter text-[#B9ADAA]/60 text-[12px] font-semibold uppercase tracking-[0.2em] mb-4">
                  Navigate
                </p>
                <ul className="space-y-2.5">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      {link.href.startsWith("/") ? (
                        <Link
                          href={link.href}
                          className="font-inter text-[#B9ADAA] hover:text-[#F4EDE8] text-[14.5px] font-medium transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className="font-inter text-[#B9ADAA] hover:text-[#F4EDE8] text-[14.5px] font-medium transition-colors duration-200"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="flex items-center gap-2.5 font-inter text-[#B9ADAA] text-[14px]">
                  <span className="text-[#B77D89]">📍</span>
                  Shebeen El-Kom, Egypt
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Column 3: Direct Contact ── */}
          <ScrollReveal animation="fadeUp" delay={0.2}>
            <div className="flex flex-col gap-5">
              <p className="font-inter text-[#B9ADAA]/60 text-[12px] font-semibold uppercase tracking-[0.2em]">
                Direct Inquiries
              </p>

              <a
                href={`mailto:${SITE_META.email}`}
                className="font-inter text-[#B9ADAA] hover:text-[#F4EDE8] text-[14.5px] font-medium transition-colors duration-200 flex items-center gap-3"
              >
                <Mail size={16} className="text-[#B77D89] flex-shrink-0" />
                {SITE_META.email}
              </a>

              <a
                href="tel:+201040217670"
                className="font-inter text-[#F4EDE8] font-medium text-[14.5px] transition-colors duration-200 flex items-center gap-3 underline underline-offset-4 decoration-[#443337] hover:text-[#B77D89] hover:decoration-[#B77D89]/60"
              >
                <Phone size={16} className="text-[#B77D89] flex-shrink-0" />
                +20 10 40217670
              </a>

              <a
                href={SITE_META.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-inter text-[#B9ADAA] hover:text-[#F4EDE8] text-[14.5px] font-medium transition-colors duration-200 flex items-center gap-3"
              >
                <span className="text-[#B77D89] flex-shrink-0">
                  <InstagramIcon />
                </span>
                @rewan__reel__ugc_creator
              </a>

              {/* ── DM on Instagram CTA ── */}
              <motion.a
                href="https://www.instagram.com/rewan__reel__ugc_creator/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-[#F4EDE8] text-[#141112] font-inter text-sm font-semibold hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md self-start cursor-pointer active:scale-98"
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
        <div className="h-px w-full bg-[#443337]" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
          <p className="font-inter text-[#B9ADAA]/50 text-[13px]">
            © {new Date().getFullYear()} Rewan Abdrabou. All rights reserved.
          </p>
          <p className="font-inter text-[#B9ADAA]/40 text-[12px] flex items-center gap-1.5">
            Crafted with <Heart size={10} className="text-[#B77D89]" /> in Shebeen El-Kom, Egypt
          </p>
        </div>
      </div>
    </section>
  );
}

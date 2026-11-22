"use client";

import { Mail, Heart } from "lucide-react";
import Link from "next/link";
import { NAV_LINKS, SITE_META } from "@/lib/constants";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.87a8.18 8.18 0 0 0 4.78 1.52V6.94a4.85 4.85 0 0 1-1.01-.25z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
);

const socialLinks = [
  { href: SITE_META.instagram, icon: InstagramIcon, label: "Instagram" },
  { href: SITE_META.tiktok, icon: TikTokIcon, label: "TikTok" },
  { href: SITE_META.youtube, icon: YoutubeIcon, label: "YouTube" },
  { href: `mailto:${SITE_META.email}`, icon: Mail, label: "Email" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#141112] border-t border-[#443337] overflow-hidden">
      <div className="section-container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12 mb-12">
          {/* Identity & Bio */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#1C1719] border border-[#443337] flex items-center justify-center">
                <span className="font-serif font-semibold text-[#F4EDE8] text-sm">R</span>
              </div>
              <span className="font-serif text-[#F4EDE8] text-xl">
                Rewan <span className="italic text-[#B77D89]">Abdrabou</span>
              </span>
            </div>
            <p className="font-inter text-[#B9ADAA] text-sm leading-relaxed max-w-[320px]">
              Rewan Abdrabou is a UGC creator, videographer, and video editor based in Shebeen El-Kom, Egypt, creating engaging visual content for medical clinics, beauty and laser centers, bloggers, influencers, and brands.
            </p>
            <div className="flex items-center gap-2 mt-5">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-[#1C1719] border border-[#443337] flex items-center justify-center text-[#B9ADAA] hover:text-[#F4EDE8] hover:border-[#B77D89] transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <p className="font-inter text-[#B9ADAA]/60 text-xs font-semibold uppercase tracking-[0.16em] mb-4">
              Navigate
            </p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("/") ? (
                    <Link
                      href={link.href}
                      className="font-inter text-[#B9ADAA] hover:text-[#F4EDE8] text-sm transition-colors duration-200 inline-flex items-center gap-2"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="font-inter text-[#B9ADAA] hover:text-[#F4EDE8] text-sm transition-colors duration-200 inline-flex items-center gap-2"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Inquiries & Contact */}
          <div>
            <p className="font-inter text-[#B9ADAA]/60 text-xs font-semibold uppercase tracking-[0.16em] mb-4">
              Contact
            </p>
            <p className="font-inter text-[#F4EDE8] text-sm mb-2">
              Shebeen El-Kom, Egypt
            </p>
            <a
              href={`mailto:${SITE_META.email}`}
              className="font-inter text-[#B9ADAA] hover:text-[#F4EDE8] text-sm transition-colors block mb-2"
            >
              {SITE_META.email}
            </a>
            <a
              href="tel:+201040217670"
              className="font-inter text-[#F4EDE8] hover:text-[#B77D89] text-sm transition-colors block"
            >
              +20 10 40217670
            </a>
          </div>
        </div>

        <div className="h-px w-full bg-[#443337]" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs font-inter text-[#B9ADAA]/50">
          <p>© {new Date().getFullYear()} Rewan Abdrabou. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Crafted with <Heart size={10} className="text-[#B77D89]" /> in Shebeen El-Kom, Egypt
          </p>
        </div>
      </div>
    </footer>
  );
}

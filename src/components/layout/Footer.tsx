"use client";

import { motion } from "framer-motion";
import { Mail, Heart } from "lucide-react";
import { NAV_LINKS, SITE_META } from "@/lib/constants";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.87a8.18 8.18 0 0 0 4.78 1.52V6.94a4.85 4.85 0 0 1-1.01-.25z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
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
    <footer className="relative bg-[#0F0A19] overflow-hidden">
      <div className="gradient-line" />

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#8B5CF6] rounded-full blur-[120px] opacity-10 pointer-events-none" />

      <div className="section-container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#F472B6] flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                <span className="font-sora font-bold text-white">R</span>
              </div>
              <span className="font-sora font-bold text-white text-lg">
                Rewan <span className="text-gradient-primary">Abdrabou</span>
              </span>
            </div>
            <p className="font-inter text-white/50 text-sm leading-relaxed max-w-[280px]">
              Egypt&apos;s premier UGC creator, crafting high-converting cinematic content for medical clinics, healthcare centers, and premium brands.
            </p>
            <div className="flex items-center gap-2 mt-5">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-[rgba(139,92,246,0.2)] flex items-center justify-center text-white/40 hover:text-[#8B5CF6] hover:border-[rgba(139,92,246,0.5)] transition-all duration-200"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-sora font-semibold text-white text-sm mb-5 uppercase tracking-widest">Navigate</p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-inter text-white/50 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-4 h-[1px] bg-[#8B5CF6] transition-all duration-300 rounded" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-sora font-semibold text-white text-sm mb-5 uppercase tracking-widest">Contact</p>
            <div className="space-y-3">
              <a
                href={`mailto:${SITE_META.email}`}
                className="flex items-center gap-3 font-inter text-white/50 hover:text-white text-sm transition-colors duration-200 group w-full"
              >
                <Mail size={16} className="text-[#8B5CF6] flex-shrink-0" />
                <span className="flex-1 min-w-0 truncate">{SITE_META.email}</span>
              </a>
              <a
                href={SITE_META.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 font-inter text-white/50 hover:text-white text-sm transition-colors duration-200 group w-full"
              >
                <div className="flex-shrink-0 text-[#F472B6]">
                  <InstagramIcon />
                </div>
                <span className="flex-1 min-w-0 truncate">@rewanabdrabou</span>
              </a>
              <p className="flex items-center gap-3 font-inter text-white/50 text-sm">
                <span className="text-[#8B5CF6] flex-shrink-0">📍</span>
                <span className="flex-1 min-w-0 truncate">Shebeen El-Kom, Egypt</span>
              </p>
            </div>
            <motion.a
              href="https://www.instagram.com/rewan__reel__ugc_creator/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xs mt-6 inline-flex w-full justify-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              DM on Instagram
            </motion.a>
          </div>
        </div>

        <div className="gradient-line mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <p className="font-inter text-white/30 text-[13px] text-center">
            © {new Date().getFullYear()} Rewan Abdrabou. All rights reserved.
          </p>
          <p className="font-inter text-white/25 text-xs flex items-center gap-1.5">
            Made with <Heart size={11} className="text-[#F472B6]" /> in Shebeen El-Kom, Egypt
          </p>
        </div>
      </div>
    </footer>
  );
}

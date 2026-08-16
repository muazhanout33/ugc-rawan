"use client";

import { Mail, MessageCircle } from "lucide-react";
import { SITE_META } from "@/lib/constants";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations";

export default function Contact() {
  return (
    <section id="contact" className="relative section-padding bg-[#130D22] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 gradient-line" />

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F472B6] rounded-[100%] blur-[150px] opacity-[0.08] pointer-events-none" />

      <div className="section-container relative z-10 max-w-3xl mx-auto">
        <ScrollReveal animation="fadeUp">
          <div className="text-center mb-14">
            <div className="section-label justify-center">
              <span className="text-[#F472B6]">✦</span>
              Get In Touch
            </div>
            <h2 className="font-heading text-section mb-6 text-balance">
              Let&apos;s create something <span className="text-gradient-accent">extraordinary.</span>
            </h2>
            <p className="font-inter text-white/60 text-base sm:text-lg max-w-lg mx-auto leading-relaxed text-pretty">
              Whether you need a full UGC campaign, cinematic reels, or professional videography for your brand — I&apos;m here to help you stand out.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="space-y-4 max-w-xl mx-auto" staggerDelay={0.1}>
          <StaggerItem>
            <a
              href={`mailto:${SITE_META.email}`}
              className="flex items-center gap-4 md:gap-6 p-5 rounded-2xl hover:bg-[rgba(139,92,246,0.05)] border border-[rgba(139,92,246,0.12)] hover:border-[rgba(139,92,246,0.3)] transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-[rgba(139,92,246,0.1)] flex items-center justify-center text-[#C084FC] group-hover:scale-110 group-hover:bg-[#8B5CF6] group-hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.2)] flex-shrink-0">
                <Mail size={20} />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="font-sora font-semibold text-white/90 text-sm mb-1">Email Me</p>
                <p className="font-inter text-white/50 text-xs md:text-sm group-hover:text-white/80 transition-colors truncate">{SITE_META.email}</p>
              </div>
            </a>
          </StaggerItem>

          <StaggerItem>
            <a
              href={`https://wa.me/${SITE_META.whatsapp.replace(/\+/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 md:gap-6 p-5 rounded-2xl hover:bg-[rgba(244,114,182,0.05)] border border-[rgba(244,114,182,0.12)] hover:border-[rgba(244,114,182,0.3)] transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-[rgba(244,114,182,0.1)] flex items-center justify-center text-[#F472B6] group-hover:scale-110 group-hover:bg-[#F472B6] group-hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(244,114,182,0.2)] flex-shrink-0">
                <MessageCircle size={20} />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="font-sora font-semibold text-white/90 text-sm mb-1">WhatsApp</p>
                <p className="font-inter text-white/50 text-xs md:text-sm group-hover:text-white/80 transition-colors truncate">{SITE_META.whatsapp}</p>
              </div>
            </a>
          </StaggerItem>

          <StaggerItem>
            <a
              href={SITE_META.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 md:gap-6 p-5 rounded-2xl hover:bg-[rgba(139,92,246,0.05)] border border-[rgba(139,92,246,0.12)] hover:border-[rgba(139,92,246,0.3)] transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-[rgba(139,92,246,0.1)] flex items-center justify-center text-[#C084FC] group-hover:scale-110 group-hover:bg-[#8B5CF6] group-hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.2)] flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="font-sora font-semibold text-white/90 text-sm mb-1">DM on Instagram</p>
                <p className="font-inter text-white/50 text-xs md:text-sm group-hover:text-white/80 transition-colors truncate">@rewanabdrabou</p>
              </div>
            </a>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}

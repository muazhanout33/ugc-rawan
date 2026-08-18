"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Camera, Film, Sparkles } from "lucide-react";
import Image from "next/image";
import { ScrollReveal, Parallax } from "@/components/animations";
import { SKILLS, TOOLS } from "@/lib/constants";

const TOOL_LOGOS: Record<string, string> = {
  "Adobe Premiere Pro": "/assets/premiere-pro-logo.png",
  "Final Cut Pro": "/assets/final-cut-logo.svg",
  "Adobe After Effects": "/assets/after-effects-logo.svg",
  "Adobe Photoshop": "/assets/photoshop-logo.svg",
};

const StatCard = memo(function StatCard({
  icon: Icon,
  label,
  value,
  index,
}: {
  icon: typeof Film;
  label: string;
  value: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
      whileHover={{ x: -5, scale: 1.02 }}
      className="glass-card px-4 py-3 rounded-xl flex items-center gap-3 bg-[#150D28]/90 border-[rgba(196,181,253,0.25)] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl cursor-default"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C4B5FD]/20 to-transparent flex items-center justify-center text-[#DDD6FE] flex-shrink-0">
        <Icon size={14} />
      </div>
      <div className="min-w-[80px]">
        <p className="font-sora font-bold text-white text-xs whitespace-nowrap">
          {label}
        </p>
        <p className="font-inter text-white/50 text-[10px] whitespace-nowrap mt-0.5">
          {value}
        </p>
      </div>
    </motion.div>
  );
});

export default function About() {
  const cards = [
    { icon: Film, label: "~400 Reels", value: "Created" },
    { icon: Camera, label: "Top Quality", value: "Production" },
  ];

  return (
    <section id="about" className="relative section-padding bg-[#0F0A19] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 gradient-line" />
      <div className="section-container relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          {/* Left visual column */}
          <Parallax speed={0.3} className="w-full lg:w-1/2 relative">
            <div className="overflow-visible">
              <ScrollReveal animation="scaleUp">
                <div className="relative rounded-[32px] p-1">
                  <div className="absolute -inset-6 bg-gradient-to-br from-[#C4B5FD]/20 via-[#E9D5FF]/10 to-transparent rounded-[48px] blur-2xl opacity-60 pointer-events-none" />
                  <div className="relative rounded-[28px] overflow-hidden bg-[#1A0A2E]">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src="/assets/rewanphoto.jpeg"
                        alt="Rewan Abdrabou — UGC Creator & Videographer"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-top"
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#0F0A19] via-[#0F0A19]/60 to-transparent" />
                      <div className="absolute top-0 left-0 w-32 h-32 bg-[#C4B5FD] rounded-full blur-[60px] opacity-20 pointer-events-none" />
                      <div className="absolute bottom-12 right-0 w-24 h-24 bg-[#E9D5FF] rounded-full blur-[50px] opacity-20 pointer-events-none" />
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl bg-gradient-to-br from-[#C4B5FD]/30 to-[#E9D5FF]/20 backdrop-blur-md border border-[rgba(196,181,253,0.3)] flex items-center justify-center z-20 shadow-[0_8px_32px_rgba(196,181,253,0.3)]">
                    <Camera size={24} className="text-white/80" />
                  </div>
                  <div className="absolute -bottom-3 -left-3 w-14 h-14 rounded-full bg-gradient-to-br from-[#E9D5FF]/40 to-[#C4B5FD]/30 backdrop-blur-md border border-[rgba(233,213,255,0.3)] z-20 shadow-[0_4px_20px_rgba(233,213,255,0.3)]" />
                  <div className="absolute top-1/4 -right-6 w-16 h-16 rounded-full border-2 border-[rgba(196,181,253,0.2)] z-10" />
                  <div className="absolute bottom-1/3 -left-4 w-3 h-3 rounded-full bg-[#C4B5FD] opacity-40 z-10" />
                </div>
              </ScrollReveal>
              <div className="absolute right-4 md:-right-6 top-[15%] md:top-1/4 flex flex-col gap-3 md:gap-4 z-20">
                {cards.map((card, i) => (
                  <StatCard key={card.label} {...card} index={i} />
                ))}
              </div>
            </div>
          </Parallax>

          {/* Right text column */}
          <div className="w-full lg:w-1/2">
            <ScrollReveal animation="fadeRight" delay={0.2}>
              <div className="section-label">
                <Sparkles size={14} className="text-[#E9D5FF]" />
                About Me
              </div>

              <h2 className="font-serif text-section mb-6 text-balance" style={{ fontWeight: 700 }}>
                The{" "}
                <span className="text-gradient-primary">creative force</span>{" "}
                behind premium content.
              </h2>

              <p className="font-inter text-white/60 text-base sm:text-lg leading-relaxed">
                I&apos;m Rewan — a UGC creator and videographer based in Shebeen El-Kom,
                Egypt. I craft{" "}
                <strong className="text-white font-medium">
                  cinematic, high-converting video
                </strong>{" "}
                for medical clinics, healthcare centers, and premium lifestyle
                brands. I also partner with fellow content creators to manage the
                full production pipeline — concept to final cut, trend-aware and
                built to engage.
              </p>

              <p className="font-inter text-white/50 text-sm sm:text-base leading-relaxed mt-4">
                Specialized in crafting launch-ready UGC and video content for
                healthcare clinics, beauty brands, tech startups, and personal brands.
              </p>

              {/* Thin divider */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(196,181,253,0.4)] to-transparent mt-8 mb-7" />

              {/* Skills pill tags */}
              <div className="flex flex-wrap gap-2">
                {[...SKILLS.creative, ...SKILLS.production].map((skill) => (
                  <span
                    key={skill.name}
                    className="inline-flex items-center rounded-full px-3.5 py-1.5 text-[13px] font-inter font-medium leading-none bg-[rgba(196,181,253,0.18)] border border-[rgba(196,181,253,0.35)] text-[#DDD6FE]"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* ─── Execution Stack ─── */}
        <ScrollReveal animation="fadeUp" delay={0.1}>
          <div className="mt-24 lg:mt-32">
            <h2 className="font-serif text-section text-center mb-16 text-balance" style={{ fontWeight: 700 }}>
              Execution Stack
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-y-12 gap-x-12 sm:gap-x-16 lg:gap-x-20">
              {TOOLS.map((tool, index) => (
                <motion.div
                  key={tool}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center gap-5"
                >
                  <div className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] lg:w-[110px] lg:h-[110px] rounded-[22px] sm:rounded-[26px] lg:rounded-[28px] overflow-hidden bg-[#150D28] border border-[rgba(196,181,253,0.12)] flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    {TOOL_LOGOS[tool] && (
                      <Image
                        src={TOOL_LOGOS[tool]}
                        alt={`${tool} logo`}
                        width={110}
                        height={110}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <span className="font-inter text-white font-medium text-[15px] sm:text-[16px] lg:text-[17px] text-center whitespace-nowrap">
                    {tool}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

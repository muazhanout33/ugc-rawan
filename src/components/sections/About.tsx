"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Film } from "lucide-react";
import { ScrollReveal } from "@/components/animations";
import { SKILLS, TOOLS } from "@/lib/constants";

const TOOL_LOGOS: Record<string, string> = {
  "Adobe Premiere Pro": "/assets/premiere-pro-logo.png",
  CapCut: "/assets/capcut-logo.png",
};

const FOCUS_AREAS = [
  "Medical Clinics & Healthcare Centers",
  "Beauty, Aesthetics & Laser Centers",
  "Bloggers & Influencers",
  "Lifestyle & Personal Brands",
  "Businesses & Startups",
];

export default function About() {
  const allSkills = [...SKILLS.creative, ...SKILLS.production];

  return (
    <section id="about" className="relative section-padding bg-[#141112] overflow-hidden border-t border-[#443337]">
      <div className="section-container relative z-10">

        {/* Main Grid: Portrait & Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left: Portrait in Clean Editorial Framing with Preserved Stat Badge */}
          <div className="lg:col-span-5 flex justify-center">
            <ScrollReveal animation="fadeUp" className="w-full max-w-[420px]">
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden bg-[#1C1719] border border-[#443337] shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src="/assets/rewanphoto.jpeg"
                      alt="Rewan Abdrabou — UGC Creator & Videographer"
                      fill
                      sizes="(max-width: 768px) 100vw, 420px"
                      className="object-cover object-top"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141112]/80 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Preserved Stat Badge — Clean Editorial Style */}
                <div className="absolute -bottom-4 -right-4 sm:-bottom-5 sm:-right-5 rounded-xl px-4 py-3 bg-[#1C1719] border border-[#443337] shadow-[0_12px_32px_rgba(0,0,0,0.7)] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#241D20] border border-[#443337] flex items-center justify-center text-[#B77D89] flex-shrink-0">
                    <Film size={16} />
                  </div>
                  <div>
                    <p className="font-sora font-semibold text-[#F4EDE8] text-sm whitespace-nowrap">
                      ~400 Reels
                    </p>
                    <p className="font-inter text-[#B9ADAA] text-[11px] whitespace-nowrap mt-0.5">
                      Created
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Thoughtful Editorial Narrative */}
          <div className="lg:col-span-7 flex flex-col">
            <ScrollReveal animation="fadeRight" delay={0.1}>
              <div className="section-label">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B77D89]" />
                About Me
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] text-[#F4EDE8] font-normal mb-6 text-balance leading-tight">
                Creating Visual Stories That Connect Brands With People.
              </h1>

              {/* Main Description */}
              <div className="space-y-4 text-[#B9ADAA] font-inter text-base sm:text-lg leading-relaxed">
                <p>
                  I&apos;m Rewan — a UGC creator, videographer, and video editor based in Shebeen El-Kom, Egypt.
                </p>
                <p>
                  I specialize in creating engaging short-form video content for medical clinics, healthcare centers, beauty and laser centers, bloggers, influencers, lifestyle brands, and businesses.
                </p>
                <p>
                  From creative concepts and scripting to filming and final editing, I work across the entire content production process to turn ideas into compelling visual stories.
                </p>
              </div>

              {/* Focus Areas */}
              <div className="mt-8">
                <p className="font-inter text-sm sm:text-base text-[#F4EDE8]/90 font-medium mb-3.5">
                  Working across different industries and creative projects, including:
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {FOCUS_AREAS.map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center rounded-full px-4 py-2 text-xs sm:text-[13px] font-inter font-medium bg-[#1C1719] border border-[#443337] text-[#F4EDE8] hover:border-[#87535F] transition-colors"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Core Disciplines */}
              <div className="mt-8 pt-8 border-t border-[#443337]">
                <p className="font-inter text-xs font-semibold tracking-wider uppercase text-[#B9ADAA]/60 mb-3.5">
                  Core Disciplines
                </p>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map((skill) => (
                    <span
                      key={skill.name}
                      className="inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-inter font-medium bg-[#141112] border border-[#443337] text-[#B9ADAA]"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>

        {/* ─── Creative Suite / Tools ─── */}
        <ScrollReveal animation="fadeUp" delay={0.1}>
          <div className="mt-20 lg:mt-28 pt-16 border-t border-[#443337]">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="section-label justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B77D89]" />
                Production Software
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#F4EDE8] font-normal text-balance">
                Post-Production Tools
              </h3>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
              {TOOLS.map((tool, index) => (
                <motion.div
                  key={tool}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-4 px-6 py-4 rounded-xl bg-[#1C1719] border border-[#443337] hover:border-[#87535F] transition-all duration-200 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 p-2 flex items-center justify-center border border-[#443337]">
                    {TOOL_LOGOS[tool] && (
                      <Image
                        src={TOOL_LOGOS[tool]}
                        alt={`${tool} logo`}
                        width={48}
                        height={48}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <span className="font-inter text-[#F4EDE8] font-medium text-sm sm:text-base">
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

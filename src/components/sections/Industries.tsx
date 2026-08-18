"use client";

import { Sparkles, Heart, Rocket, Crown } from "lucide-react";
import { INDUSTRIES } from "@/lib/constants";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations";

const iconMap: Record<string, React.ElementType> = {
  Heart,
  Sparkles,
  Rocket,
  Crown,
};

export default function Industries() {
  return (
    <section id="industries" className="relative section-padding bg-[#130D22]">
      <div className="absolute top-0 left-0 right-0 gradient-line" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-[#E9D5FF] rounded-[100%] blur-[150px] opacity-[0.03] pointer-events-none" />

      <div className="section-container relative z-10">
        <ScrollReveal animation="fadeUp" className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="section-label justify-center">
            <Sparkles size={14} className="text-[#E9D5FF]" />
            Industries
          </div>
          <h2 className="font-heading text-section mb-5 text-balance">
            Content for <span className="text-gradient-accent">every industry</span>.
          </h2>
          <p className="font-inter text-white/50 text-base sm:text-lg text-pretty">
            Specialized content creation for diverse sectors — from medical clinics to tech startups.
          </p>
        </ScrollReveal>

        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
          staggerDelay={0.08}
        >
          {INDUSTRIES.map((industry) => {
            const Icon = iconMap[industry.icon] || Sparkles;

            return (
              <StaggerItem key={industry.id}>
                <div className="glass-card p-6 group glass-card-hover relative overflow-hidden flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-[rgba(196,181,253,0.03)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#C4B5FD] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-x-0 group-hover:scale-x-100 origin-left" />

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-[rgba(196,181,253,0.1)] border border-[rgba(196,181,253,0.2)] flex items-center justify-center text-[#DDD6FE] group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_20px_rgba(196,181,253,0.3)] mb-4">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>

                    <h3 className="font-sora font-semibold text-white text-base mb-2 group-hover:text-[#DDD6FE] transition-colors">
                      {industry.title}
                    </h3>
                    
                    <p className="font-inter text-white/50 text-sm leading-relaxed">
                      {industry.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
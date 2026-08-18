"use client";

import { memo } from "react";
import { Star, Stethoscope } from "lucide-react";
import {
  TRUSTED_MEDICAL_CENTERS,
  TRUSTED_DOCTORS,
  TRUSTED_BRANDS,
} from "@/lib/constants";
import Image from "next/image";
import { ScrollReveal } from "@/components/animations";

/* ───────── Marquee Logo Item ───────── */

const MarqueeLogoItem = memo(function MarqueeLogoItem({
  item,
}: {
  item: { name: string; logo: string; industry?: string };
}) {
  return (
    <div className="flex-shrink-0 flex items-center gap-4 px-6 py-4 rounded-2xl bg-[rgba(27,18,48,0.4)] border border-white/[0.06] hover:border-[#C4B5FD]/40 hover:bg-[rgba(27,18,48,0.6)] transition-all duration-300 group mx-3">
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white/[0.04] border border-white/[0.08] p-2.5 group-hover:border-[#C4B5FD]/40 transition-all duration-300 relative overflow-hidden flex items-center justify-center flex-shrink-0">
        <Image
          src={item.logo}
          alt={item.name}
          fill
          sizes="96px"
          loading="lazy"
          className="object-contain p-1.5"
        />
      </div>
      <div className="min-w-0">
        <p className="font-sora font-semibold text-white text-sm sm:text-base leading-snug whitespace-nowrap">
          {item.name}
        </p>
        {item.industry && (
          <p className="font-inter text-white/40 text-xs mt-1 whitespace-nowrap">
            {item.industry}
          </p>
        )}
      </div>
    </div>
  );
});

/* ───────── Marquee Doctor Item ───────── */

const MarqueeDoctorItem = memo(function MarqueeDoctorItem({
  doctor,
}: {
  doctor: (typeof TRUSTED_DOCTORS)[0];
}) {
  return (
    <div className="flex-shrink-0 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-[rgba(27,18,48,0.4)] border border-white/[0.06] hover:border-[#C4B5FD]/30 hover:bg-[rgba(27,18,48,0.6)] transition-all duration-300 mx-2.5">
      <span className="w-1.5 h-1.5 rounded-full bg-[#C4B5FD] flex-shrink-0" />
      <div className="min-w-0">
        <p className="font-sora font-semibold text-white text-sm leading-snug whitespace-nowrap">
          {doctor.name}
        </p>
        {doctor.specialty && (
          <p className="font-inter text-white/40 text-xs mt-0.5 leading-snug whitespace-nowrap pr-2">
            {doctor.specialty}
          </p>
        )}
      </div>
    </div>
  );
});

/* ───────── Main Component ───────── */

export default function TrustedBy() {
  const allLogos = [...TRUSTED_MEDICAL_CENTERS, ...TRUSTED_BRANDS];

  return (
    <section
      id="clients"
      className="relative section-padding bg-[#0F0A19] overflow-hidden"
    >
      {/* Background aesthetics */}
      <div className="absolute top-0 left-0 right-0 gradient-line" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[40%] bg-[#C4B5FD] rounded-full blur-[160px] opacity-[0.04] pointer-events-none" />

      <div className="section-container relative z-10">
        {/* ─── Main Section Header ─── */}
        <ScrollReveal animation="fadeUp" className="text-center max-w-3xl mx-auto mb-16">
          <div className="section-label justify-center">
            <Star size={14} className="text-[#E9D5FF]" />
            Trusted By
          </div>
          <h2 className="font-heading text-section mb-5 text-balance">
            Trusted by <span className="text-gradient-primary">industry leaders</span>.
          </h2>
          <p className="font-inter text-white/50 text-base sm:text-lg text-pretty leading-relaxed">
            Partnering with top medical centers, renowned doctors, and innovative
            brands across Egypt.
          </p>
        </ScrollReveal>

        {/* ─── Client Logo Marquee (RIGHT → LEFT) ─── */}
        <div className="relative mb-20">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#0F0A19] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#0F0A19] to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden">
            <div
              className="marquee-track animate-marquee"
              style={{ "--marquee-duration": "35s" } as React.CSSProperties}
            >
              {allLogos.map((item) => (
                <MarqueeLogoItem key={item.id} item={item} />
              ))}
              {allLogos.map((item) => (
                <MarqueeLogoItem key={`dup-${item.id}`} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* ─── Doctors & Specialists Marquee (LEFT → RIGHT) ─── */}
        <div>
          <div className="flex items-center gap-3.5 mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(233, 213, 255, 0.1)",
                border: "1px solid rgba(233, 213, 255, 0.25)",
              }}
            >
              <Stethoscope size={18} style={{ color: "rgb(233, 213, 255)" }} />
            </div>
            <div>
              <h3 className="font-sora font-semibold text-white text-lg leading-snug">
                Doctors & Specialists
              </h3>
              <p className="font-inter text-white/40 text-xs mt-0.5">Renowned medical professionals</p>
            </div>
          </div>

          <div className="relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[#0F0A19] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[#0F0A19] to-transparent z-10 pointer-events-none" />

            <div className="overflow-hidden">
              <div
                className="marquee-track animate-marquee-reverse"
                style={{ "--marquee-duration": "50s" } as React.CSSProperties}
              >
                {TRUSTED_DOCTORS.map((doctor) => (
                  <MarqueeDoctorItem key={doctor.id} doctor={doctor} />
                ))}
                {TRUSTED_DOCTORS.map((doctor) => (
                  <MarqueeDoctorItem key={`dup-${doctor.id}`} doctor={doctor} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

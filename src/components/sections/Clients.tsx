"use client";

import { memo } from "react";
import {
  TRUSTED_MEDICAL_CENTERS,
  TRUSTED_DOCTORS,
  TRUSTED_BRANDS,
} from "@/lib/constants";
import Image from "next/image";
import { ScrollReveal } from "@/components/animations";

/* ───────── Logo Item ───────── */

const MarqueeLogoItem = memo(function MarqueeLogoItem({
  item,
}: {
  item: { name: string; logo: string; industry?: string; instagram?: string };
}) {
  const inner = (
    <>
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#141112] border border-[#443337] p-2 group-hover:border-[#B77D89]/50 transition-all duration-200 relative overflow-hidden flex items-center justify-center flex-shrink-0">
        <Image
          src={item.logo}
          alt={item.name}
          fill
          sizes="80px"
          loading="lazy"
          className="object-contain p-1.5"
        />
      </div>
      <div className="min-w-0 text-left">
        <p className="font-sora font-medium text-[#F4EDE8] text-sm sm:text-base leading-snug whitespace-nowrap group-hover:text-white transition-colors">
          {item.name}
        </p>
        {item.industry && (
          <p className="font-inter text-[#B9ADAA] text-xs mt-0.5 whitespace-nowrap">
            {item.industry}
          </p>
        )}
      </div>
    </>
  );

  const className =
    "flex-shrink-0 flex items-center gap-4 px-5 py-3.5 rounded-xl bg-[#1C1719] border border-[#443337] hover:border-[#B77D89]/60 hover:bg-[#241D20] transition-all duration-200 group mx-3 shadow-sm";

  if (item.instagram) {
    return (
      <a
        href={item.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {inner}
      </a>
    );
  }

  return <div className={className}>{inner}</div>;
});

/* ───────── Doctor Item ───────── */

const MarqueeDoctorItem = memo(function MarqueeDoctorItem({
  doctor,
}: {
  doctor: (typeof TRUSTED_DOCTORS)[0];
}) {
  return (
    <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg bg-[#1C1719] border border-[#443337] hover:border-[#B77D89]/50 hover:bg-[#241D20] transition-all duration-200 mx-2 text-left">
      <span className="w-1.5 h-1.5 rounded-full bg-[#B77D89] flex-shrink-0" />
      <div className="min-w-0">
        <p className="font-sora font-medium text-[#F4EDE8] text-xs sm:text-sm leading-snug whitespace-nowrap">
          {doctor.name}
        </p>
        {doctor.specialty && (
          <p className="font-inter text-[#B9ADAA] text-[11px] mt-0.5 leading-snug whitespace-nowrap pr-2">
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
      className="relative section-padding bg-[#141112] overflow-hidden border-t border-[#443337]"
    >
      <div className="section-container relative z-10">
        {/* Section Header */}
        <ScrollReveal animation="fadeUp" className="text-center max-w-2xl mx-auto mb-14">
          <div className="section-label justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B77D89]" />
            Clients &amp; Collaborations
          </div>
          <h2 className="font-serif text-section text-[#F4EDE8] font-normal mb-4 text-balance">
            Trusted by healthcare clinics, specialists, and brands.
          </h2>
          <p className="font-inter text-[#B9ADAA] text-sm sm:text-base leading-relaxed text-pretty">
            Medical centers, consultant physicians, and commercial partners
            I have produced video content for.
          </p>
        </ScrollReveal>

        {/* Client Logos Marquee */}
        <div className="relative mb-16">
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-r from-[#141112] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-l from-[#141112] to-transparent z-10 pointer-events-none" />

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

        {/* Doctors & Specialists Marquee */}
        <div>
          <div className="text-center mb-6">
            <span className="font-inter text-xs uppercase tracking-[0.2em] text-[#B9ADAA] font-semibold">
              Consultants &amp; Specialists
            </span>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#141112] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#141112] to-transparent z-10 pointer-events-none" />

            <div className="overflow-hidden">
              <div
                className="marquee-track animate-marquee-reverse"
                style={{ "--marquee-duration": "48s" } as React.CSSProperties}
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

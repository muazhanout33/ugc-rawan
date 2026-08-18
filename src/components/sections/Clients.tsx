"use client";

import { memo, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Star, Stethoscope, ChevronDown } from "lucide-react";
import {
  TRUSTED_MEDICAL_CENTERS,
  TRUSTED_DOCTORS,
  TRUSTED_BRANDS,
} from "@/lib/constants";
import Image from "next/image";
import { ScrollReveal } from "@/components/animations";

/* ───────── Responsive default doctors count ───────── */

const DOCTORS_DEFAULT = {
  mobile: 4,
  desktop: 8,
};

const desktopQuery = () =>
  typeof window !== "undefined"
    ? window.matchMedia("(min-width: 1024px)")
    : null;

function getDoctorCountSnapshot(): number {
  return desktopQuery()?.matches ? DOCTORS_DEFAULT.desktop : DOCTORS_DEFAULT.mobile;
}

function subscribeDoctorCount(callback: () => void): () => void {
  const mq = desktopQuery();
  if (!mq) return () => {};
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function useDefaultDoctorCount(): number {
  return useSyncExternalStore(
    subscribeDoctorCount,
    getDoctorCountSnapshot,
    () => DOCTORS_DEFAULT.mobile
  );
}

/* ───────── Marquee Logo Item ───────── */

const MarqueeLogoItem = memo(function MarqueeLogoItem({
  item,
}: {
  item: { name: string; logo: string; industry?: string };
}) {
  return (
    <div className="flex-shrink-0 flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#C4B5FD]/40 hover:bg-white/[0.05] transition-all duration-300 group mx-3">
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white/5 border border-white/15 p-2.5 group-hover:border-[#C4B5FD]/40 transition-all duration-300 relative overflow-hidden flex items-center justify-center flex-shrink-0">
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

/* ───────── Doctor Card ───────── */

const DoctorCard = memo(function DoctorCard({
  doctor,
  index,
}: {
  doctor: (typeof TRUSTED_DOCTORS)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group relative"
    >
      <div className="rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 px-4 py-3.5 flex items-center justify-between gap-3 hover:border-[#C4B5FD]/40 hover:bg-white/[0.06] transition-all duration-300 hover:shadow-[0_4px_20px_rgba(196,181,253,0.1)] hover:-translate-y-0.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4B5FD] group-hover:bg-[#E9D5FF] transition-colors flex-shrink-0" />
            <p className="font-sora font-semibold text-white text-sm leading-snug truncate">
              {doctor.name}
            </p>
          </div>
          {doctor.specialty && (
            <p className="font-inter text-white/40 text-xs pl-3.5 mt-0.5 leading-snug pr-1">
              {doctor.specialty}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
});

/* ───────── Main Component ───────── */

export default function TrustedBy() {
  const defaultDoctorCount = useDefaultDoctorCount();
  const [showAllDoctors, setShowAllDoctors] = useState(false);

  const visibleDoctors = showAllDoctors
    ? TRUSTED_DOCTORS
    : TRUSTED_DOCTORS.slice(0, defaultDoctorCount);

  const handleToggleDoctors = () => {
    setShowAllDoctors((v) => !v);
  };

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

        {/* ─── Client Logo Marquee ─── */}
        <div className="relative mb-20">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#0F0A19] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#0F0A19] to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden">
            <div
              className="marquee-track animate-marquee"
              style={{ "--marquee-duration": "35s" } as React.CSSProperties}
            >
              {/* First set */}
              {allLogos.map((item) => (
                <MarqueeLogoItem key={item.id} item={item} />
              ))}
              {/* Duplicate set for seamless loop */}
              {allLogos.map((item) => (
                <MarqueeLogoItem key={`dup-${item.id}`} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* ─── Doctors & Specialists ─── */}
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

          <motion.div
            layout
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
          >
            {visibleDoctors.map((doctor, index) => (
              <DoctorCard key={doctor.id} doctor={doctor} index={index} />
            ))}
          </motion.div>

          {/* Show All / Show Less toggle */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleToggleDoctors}
              className="group inline-flex items-center gap-2.5 font-inter text-sm font-medium text-white/80 hover:text-white transition-colors duration-250"
              aria-expanded={showAllDoctors}
              aria-controls="doctors-grid"
            >
              <span className="w-px h-4 bg-[#E9D5FF] transition-all duration-300 group-hover:w-4 group-hover:bg-gradient-to-r group-hover:from-[#E9D5FF] group-hover:to-[#DDD6FE]" />
              {showAllDoctors
                ? "Show Less"
                : `Show All Doctors (${TRUSTED_DOCTORS.length})`}
              <ChevronDown
                size={15}
                className={`transition-transform duration-300 ${
                  showAllDoctors ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { memo, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Star, Building2, Stethoscope, Briefcase, Award, ChevronDown } from "lucide-react";
import {
  TRUSTED_MEDICAL_CENTERS,
  TRUSTED_DOCTORS,
  TRUSTED_BRANDS,
} from "@/lib/constants";
import Image from "next/image";
import { ScrollReveal } from "@/components/animations";

const TEAM_MEMBERS = [
  {
    id: "muaz",
    name: "Muaz Hanout",
    role: "Co-Founder",
    company: "ScalaryX",
  },
  {
    id: "omar",
    name: "Omar Gamal",
    role: "Co-Founder",
    company: "ScalaryX",
  },
];

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

/* ───────── Category Header Component ───────── */
function CategoryHeader({
  icon: Icon,
  title,
  subtitle,
  accentColor = "196, 181, 253",
}: {
  icon: typeof Building2;
  title: string;
  subtitle: string;
  accentColor?: string;
}) {
  return (
    <div className="flex items-center gap-3.5 mb-8">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: `rgba(${accentColor}, 0.1)`,
          border: `1px solid rgba(${accentColor}, 0.25)`,
        }}
      >
        <Icon size={18} style={{ color: `rgb(${accentColor})` }} />
      </div>
      <div>
        <h3 className="font-sora font-semibold text-white text-lg leading-snug">
          {title}
        </h3>
        <p className="font-inter text-white/40 text-xs mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

/* ───────── Medical Center Card ───────── */

const MedicalCenterCard = memo(function MedicalCenterCard({
  center,
  index,
}: {
  center: (typeof TRUSTED_MEDICAL_CENTERS)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 p-7 flex flex-col items-center text-center h-full hover:border-[#C4B5FD]/50 hover:bg-white/[0.05] transition-all duration-400 hover:shadow-[0_12px_40px_rgba(196,181,253,0.15)] hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C4B5FD]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/15 p-3 mb-5 group-hover:border-[#C4B5FD]/40 group-hover:scale-105 transition-all duration-400 relative overflow-hidden flex items-center justify-center shadow-lg">
            <Image
              src={center.logo}
              alt={center.name}
              fill
              sizes="80px"
              loading="lazy"
              className="object-contain p-2"
            />
          </div>
          <h4 className="font-sora font-semibold text-white text-base mb-1.5 leading-snug">
            {center.name}
          </h4>
          <span className="inline-block px-3 py-1 rounded-full bg-[#C4B5FD]/10 border border-[#C4B5FD]/20 font-inter text-[#DDD6FE] text-[11px] font-medium tracking-wide">
            {center.industry}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

/* ───────── Doctor Card (NO Initial Circles) ───────── */

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
        <ScrollReveal animation="fadeUp" className="text-center max-w-3xl mx-auto mb-20">
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

        <div className="space-y-20">
          {/* ═══════════════════════════════════════════════════════════
              CATEGORY 1: MEDICAL CENTERS (3-Column Grid)
          ═══════════════════════════════════════════════════════════ */}
          <div>
            <CategoryHeader
              icon={Building2}
              title="Medical Centers"
              subtitle="Premium clinics & healthcare facilities"
              accentColor="196, 181, 253"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TRUSTED_MEDICAL_CENTERS.map((center, index) => (
                <MedicalCenterCard key={center.id} center={center} index={index} />
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              CATEGORY 2: DOCTORS & SPECIALISTS (4-Column Grid, No Initial Circles)
          ═══════════════════════════════════════════════════════════ */}
          <div>
            <CategoryHeader
              icon={Stethoscope}
              title="Doctors & Specialists"
              subtitle="Renowned medical professionals"
              accentColor="233, 213, 255"
            />

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

          {/* ═══════════════════════════════════════════════════════════
              CATEGORY 3: BRANDS & FOUNDERS (Clean Unified Grid Layout)
          ═══════════════════════════════════════════════════════════ */}
          <div>
            <CategoryHeader
              icon={Briefcase}
              title="Brands & Founders"
              subtitle="Innovative companies & agency leaders"
              accentColor="196, 181, 253"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ScalaryX Brand Card */}
              {TRUSTED_BRANDS.map((brand) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="group relative"
                >
                  <div className="rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 p-7 flex flex-col items-center text-center h-full hover:border-[#C4B5FD]/50 hover:bg-white/[0.05] transition-all duration-400 hover:shadow-[0_12px_40px_rgba(196,181,253,0.15)] hover:-translate-y-1">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/15 p-3 mb-5 group-hover:border-[#C4B5FD]/40 group-hover:scale-105 transition-all duration-400 relative overflow-hidden flex items-center justify-center shadow-lg">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        sizes="80px"
                        loading="lazy"
                        className="object-contain p-2"
                      />
                    </div>
                    <h4 className="font-sora font-semibold text-white text-base mb-1.5">
                      {brand.name}
                    </h4>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#C4B5FD]/10 border border-[#C4B5FD]/20 font-inter text-[#DDD6FE] text-[11px] font-medium tracking-wide">
                      {brand.industry}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Founder Cards (No Initial Circles) */}
              {TEAM_MEMBERS.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                  className="group relative"
                >
                  <div className="rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 p-7 flex flex-col items-center justify-center text-center h-full hover:border-[#C4B5FD]/40 hover:bg-white/[0.05] transition-all duration-400 hover:shadow-[0_12px_40px_rgba(196,181,253,0.12)] hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-xl bg-[#C4B5FD]/10 border border-[#C4B5FD]/20 flex items-center justify-center text-[#DDD6FE] mb-4 group-hover:scale-110 transition-transform">
                      <Award size={20} />
                    </div>
                    <h4 className="font-sora font-semibold text-white text-base mb-1">
                      {member.name}
                    </h4>
                    <p className="font-inter text-[#DDD6FE] text-xs font-medium mb-1">
                      {member.role}
                    </p>
                    <span className="font-inter text-white/40 text-[11px]">
                      {member.company}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
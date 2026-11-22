"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { SITE_META } from "@/lib/constants";
import { ScrollReveal } from "@/components/animations";

const InstagramIcon = ({ size = 16, className }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const CAMPAIGN_POSTS = [
  {
    id: 1,
    image: "/assets/aroma-center.jpg",
    client: "Aroma Center",
    category: "Aesthetic & Skincare",
    url: "https://www.instagram.com/aroma.center1/",
  },
  {
    id: 2,
    image: "/assets/elqaser-center.png",
    client: "El Qaser Center",
    category: "Medical & Specialized Care",
    url: "https://www.instagram.com/elqaser.center/",
  },
  {
    id: 3,
    image: "/assets/golden-beauty-clinic.jpeg",
    client: "Golden Beauty Clinic",
    category: "Cosmetics & Laser",
    url: "https://www.instagram.com/rewan__reel__ugc_creator/?hl=en",
  },
  {
    id: 4,
    image: "/assets/queen-clinic.jpeg",
    client: "Queen Clinic",
    category: "Dermatology & Wellness",
    url: "https://www.instagram.com/rewan__reel__ugc_creator/?hl=en",
  },
  {
    id: 5,
    image: "/assets/sky-center.png",
    client: "Sky Center",
    category: "Laser & Healthcare",
    url: "https://www.instagram.com/sky_center2025/",
  },
  {
    id: 6,
    image: "/assets/scalaryx.jpeg",
    client: "Scalaryx",
    category: "Agency Production",
    url: "https://www.instagram.com/scalary_x/",
  },
];

export default function InstagramSection() {
  return (
    <section id="instagram" className="relative section-padding bg-[#141112] overflow-hidden border-t border-[#443337]">
      <div className="section-container relative z-10">
        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 lg:mb-16">
          <ScrollReveal animation="fadeUp" className="max-w-2xl">
            <div className="section-label">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B77D89]" />
              Social &amp; On-Set Production
            </div>

            <h2 className="font-serif text-section text-[#F4EDE8] font-normal mb-5 text-balance">
              Behind the scenes &amp;{" "}
              <span className="italic font-light text-[#F4EDE8]/90">
                client campaigns
              </span>
              .
            </h2>

            <p className="font-inter text-[#B9ADAA] text-base sm:text-lg leading-relaxed text-pretty max-w-xl">
              Documenting on-location shoots, recent commercial reels, and production
              stills for medical clinics, specialists, and lifestyle brands across Egypt.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fadeLeft" delay={0.1} className="flex-shrink-0">
            <motion.a
              href={SITE_META.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#F4EDE8] text-[#141112] font-inter text-sm font-semibold hover:bg-white transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-98"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <InstagramIcon size={16} className="text-[#87535F]" />
              <span>Follow @rewan__reel__ugc_creator</span>
              <ArrowUpRight size={14} className="text-black/60" />
            </motion.a>
          </ScrollReveal>
        </div>

        {/* Editorial Production Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5">
          {CAMPAIGN_POSTS.map((post, index) => (
            <motion.a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col rounded-xl overflow-hidden bg-[#1C1719] border border-[#443337] hover:border-[#87535F] transition-all duration-300 shadow-sm"
            >
              {/* Media Still */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/40">
                <Image
                  src={post.image}
                  alt={post.client}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                {/* Top-Right: External link glyph */}
                <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#141112]/80 border border-[#443337] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[#F4EDE8]">
                  <ArrowUpRight size={12} />
                </div>

                {/* Bottom Card Meta */}
                <div className="absolute bottom-0 inset-x-0 p-3 pointer-events-none">
                  <p className="font-sora text-[#F4EDE8] text-xs font-semibold leading-tight truncate">
                    {post.client}
                  </p>
                  <p className="font-inter text-[#B9ADAA] text-[10px] mt-0.5 truncate">
                    {post.category}
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Understated bottom channel bar */}
        <div className="mt-8 pt-6 border-t border-[#443337] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-inter text-[#B9ADAA]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B77D89]" />
            <span>Active on Instagram — Open for video collaborations &amp; commercial productions</span>
          </div>
          <a
            href={SITE_META.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#F4EDE8] transition-colors flex items-center gap-1.5"
          >
            <span>View all Instagram stories</span>
            <ArrowUpRight size={12} className="text-[#B77D89]" />
          </a>
        </div>
      </div>
    </section>
  );
}

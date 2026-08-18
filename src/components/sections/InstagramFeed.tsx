"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";

const InstagramIcon = ({ size = 14, className }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
import { SITE_META } from "@/lib/constants";
import Image from "next/image";

const INSTAGRAM_POSTS = [
  { id: 1, image: "/assets/aroma-center.jpg", caption: "Skincare transformation", instagram: "https://www.instagram.com/aroma.center1/" },
  { id: 2, image: "/assets/elqaser-center.png", caption: "Brand reveal", instagram: "https://www.instagram.com/elqaser.center/" },
  { id: 5, image: "/assets/scalaryx.jpeg", caption: "Agency promo", instagram: "https://www.instagram.com/scalary_x/" },
  { id: 6, image: "/assets/sky-center.png", caption: "Laser treatment", instagram: "https://www.instagram.com/sky_center2025/" },
  { id: 7, image: "/assets/queen-clinic.jpeg", caption: "Queen Clinic skincare" },
];

function PhoneMockup() {
  return (
    <div className="relative mx-auto" style={{ maxWidth: "320px" }}>
      {/* iPhone Frame */}
      <div className="relative bg-[#1A1A1A] rounded-[50px] p-3 shadow-[0_0_60px_rgba(196,181,253,0.2),0_20px_60px_rgba(0,0,0,0.5)] border-2 border-[#2A2A2A]">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-[#1A1A1A] rounded-b-2xl z-20" />
        
        {/* Screen */}
        <div className="bg-black rounded-[40px] overflow-hidden">
          {/* Status Bar */}
          <div className="h-12 flex items-end justify-between px-6 pb-2 bg-black">
            <span className="text-white text-xs font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 border border-white/80 rounded-sm flex items-end p-[1px]">
                <div className="w-full h-[60%] bg-white/80 rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* Instagram Header */}
          <div className="bg-black px-4 py-2 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C4B5FD] to-[#E9D5FF] p-[2px]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">R</span>
                </div>
              </div>
              <div>
                <p className="text-white text-[10px] font-semibold leading-tight">rewan__reel__ugc_creator</p>
                <p className="text-white/40 text-[8px]">Shebeen El-Kom, Egypt</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>

          {/* Instagram Feed */}
          <div className="bg-black">
            {/* Main Post */}
            <div className="relative aspect-square">
              <Image
                src={INSTAGRAM_POSTS[0].image}
                alt={`Instagram post — ${INSTAGRAM_POSTS[0].caption}`}
                fill
                sizes="300px"
                className="object-cover"
              />
            </div>

            {/* Actions */}
            <div className="px-3 py-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <Heart size={18} className="text-white fill-transparent" />
                  <MessageCircle size={18} className="text-white" />
                  <Send size={18} className="text-white" />
                </div>
                <Bookmark size={18} className="text-white" />
              </div>
              <p className="text-white text-[10px] font-semibold mb-1">View post</p>
              <p className="text-white text-[10px]">
                <span className="font-semibold">rewan__reel__ugc_creator</span>{" "}
                <span className="text-white/70">{INSTAGRAM_POSTS[0].caption}</span>
              </p>
            </div>
          </div>

          {/* Home Indicator */}
          <div className="h-8 flex items-center justify-center bg-black">
            <div className="w-24 h-1 bg-white/30 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InstagramSection() {
  return (
    <section id="instagram" className="relative section-padding bg-[#0F0A19] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 gradient-line" />

      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#C4B5FD] rounded-[100%] blur-[150px] opacity-[0.04] pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Content */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="section-label">
                <InstagramIcon size={14} className="text-[#E9D5FF]" />
                Instagram
              </div>

              <h2 className="font-heading text-section mb-5 text-balance">
                Follow the <span className="text-gradient-accent">journey</span>.
              </h2>

              <p className="font-inter text-white/60 text-base sm:text-lg mb-8 leading-relaxed max-w-md text-pretty">
                Behind-the-scenes, new projects, and daily content inspiration. 
                See the work in action and join the community.
              </p>

              <motion.a
                href={SITE_META.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[rgba(10,6,20,0.85)] border border-[rgba(196,181,253,0.35)] text-white font-inter text-base font-medium shadow-[0_0_16px_rgba(196,181,253,0.1)] transition-all duration-300 hover:bg-[rgba(15,10,30,0.95)] hover:border-[rgba(196,181,253,0.55)] hover:shadow-[0_0_28px_rgba(196,181,253,0.2)] cursor-pointer max-w-full"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <InstagramIcon size={18} />
                <span className="hidden sm:inline">Follow @rewan__reel__ugc_creator</span>
                <span className="sm:hidden">Follow on Instagram</span>
              </motion.a>
            </motion.div>
          </div>

          {/* Right Phone Mockup */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <a
                href={SITE_META.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="block cursor-pointer"
              >
                <PhoneMockup />
              </a>
            </motion.div>
          </div>
        </div>

        {/* Post Grid Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3"
        >
          {INSTAGRAM_POSTS.map((post, index) => (
            <motion.a
              key={post.id}
              href={post.instagram || SITE_META.instagram}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A19]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-3 text-white">
                  <div className="flex items-center gap-1">
                    <Heart size={12} className="fill-current" />
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={12} className="fill-current" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

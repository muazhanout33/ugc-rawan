"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");

  // Detect /about page for active state
  useEffect(() => {
    if (window.location.pathname === "/about") {
      setActiveSection("/about");
    }
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Only observe hash-based sections (skip /about route)
    const sections = NAV_LINKS
      .map((l) => l.href)
      .filter((href) => href.startsWith("#"))
      .map((href) => href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNavClick = useCallback(
    (href: string) => {
      setMobileOpen(false);
      // For external routes (like /about), navigate directly
      if (href.startsWith("/")) {
        window.location.href = href;
        return;
      }
      // If on /about page, navigate to home then scroll to section
      if (window.location.pathname === "/about") {
        window.location.href = `/${href}`;
        return;
      }
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
    []
  );

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "py-3 bg-[rgba(12,8,22,0.92)] backdrop-blur-md border-b border-[rgba(196,181,253,0.1)] shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            : "py-5 bg-transparent"
        )}
      >
        <div className="section-container flex items-center justify-between">
          {/* Brand */}
          <motion.a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#home");
            }}
            className="shrink-0"
            whileHover={{ scale: 1.02 }}
          >
            <span className="font-sora font-bold text-white text-[15px] tracking-tight">
              Created by Rewan Abdrabou{" "}
              <span className="text-white/40 font-medium">| UGC Creator &amp; Visual Storyteller</span>
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10 xl:gap-12 ml-auto mr-4 xl:mr-6">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={cn(
                    "relative px-3 py-2 font-inter text-[13.5px] font-medium rounded-lg transition-all duration-300 group",
                    isActive
                      ? "text-white"
                      : "text-white/50 hover:text-white/90"
                  )}
                >
                  {/* Hover background */}
                  <span
                    className={cn(
                      "absolute inset-0 rounded-lg transition-all duration-300",
                      isActive
                        ? "bg-[rgba(196,181,253,0.12)]"
                        : "bg-transparent group-hover:bg-[rgba(196,181,253,0.08)]"
                    )}
                  />
                  {/* Active indicator dot */}
                  <span
                    className={cn(
                      "absolute top-1 right-1.5 w-1 h-1 rounded-full transition-all duration-300",
                      isActive
                        ? "bg-[#C4B5FD] opacity-100 scale-100"
                        : "opacity-0 scale-0"
                    )}
                  />
                  {/* Bottom underline */}
                  <span
                    className={cn(
                      "absolute bottom-0 left-5 right-5 h-[2px] rounded-full origin-left transition-all duration-400",
                      isActive
                        ? "bg-gradient-to-r from-[#C4B5FD] to-[#DDD6FE] scale-x-100"
                        : "bg-gradient-to-r from-[#C4B5FD] to-[#DDD6FE] scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                  <span className="relative z-10">{link.label}</span>
                </motion.a>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center ml-4 xl:ml-6">
            <motion.a
              href="https://www.instagram.com/rewan__reel__ugc_creator/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent border border-[rgba(196,181,253,0.4)] text-white text-[13px] font-medium font-inter shadow-[0_0_20px_rgba(196,181,253,0.15)] transition-all duration-300 hover:border-[rgba(196,181,253,0.6)] hover:shadow-[0_0_28px_rgba(196,181,253,0.25)]"
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{ scale: 0.97 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              DM on Instagram
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2.5 rounded-xl border border-[rgba(196,181,253,0.2)] text-white/70 hover:text-white hover:border-[rgba(196,181,253,0.4)] hover:bg-[rgba(196,181,253,0.08)] transition-all duration-300"
            onClick={() => setMobileOpen(!mobileOpen)}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-[#0F0A19]/95 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />
            <nav className="relative z-10 flex flex-col items-center justify-center h-full gap-1 pb-24">
              {NAV_LINKS.map((link, i) => {
                const isActive = activeSection === link.href;
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{
                      delay: i * 0.06,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={cn(
                      "text-2xl font-sora font-semibold transition-all duration-300 py-3.5 px-8 rounded-xl w-[260px] text-center",
                      isActive
                        ? "text-white bg-[rgba(196,181,253,0.15)]"
                        : "text-white/50 hover:text-white hover:bg-[rgba(196,181,253,0.08)]"
                    )}
                  >
                    {link.label}
                  </motion.a>
                );
              })}
              <motion.a
                href="https://www.instagram.com/rewan__reel__ugc_creator/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 mt-8 rounded-full bg-transparent border border-[rgba(196,181,253,0.4)] text-white text-[13px] font-medium font-inter shadow-[0_0_20px_rgba(196,181,253,0.15)]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                DM on Instagram
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

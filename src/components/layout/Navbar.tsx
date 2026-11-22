"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== "undefined" && window.location.pathname === "/about") {
      return "/about";
    }
    return "#home";
  });

  useEffect(() => {
    let lastScrolled = false;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 40;
          if (isScrolled !== lastScrolled) {
            lastScrolled = isScrolled;
            setScrolled(isScrolled);
          }
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
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "py-3 bg-[#141112]/92 backdrop-blur-md border-b border-[#443337] shadow-[0_4px_30px_rgba(0,0,0,0.65)]"
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
            className="shrink-0 flex items-center"
            whileHover={{ scale: 1.01 }}
          >
            <span className="font-serif text-[17px] sm:text-[19px] font-medium text-[#F4EDE8] tracking-wide">
              Rewan Abdrabou
            </span>
            <span className="text-[#443337] mx-2 sm:mx-2.5 font-light">|</span>
            <span className="text-[11.5px] sm:text-[13px] text-[#B9ADAA] font-inter font-normal">
              <span className="hidden xs:inline">UGC Creator &amp; </span>Visual Storyteller
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 ml-auto mr-6 xl:mr-8">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={cn(
                    "relative py-1 font-inter text-[13.5px] font-medium transition-colors duration-200",
                    isActive
                      ? "text-[#F4EDE8]"
                      : "text-[#B9ADAA] hover:text-[#F4EDE8]"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#B77D89] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center">
            <motion.a
              href="https://www.instagram.com/rewan__reel__ugc_creator/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1719]/70 hover:bg-[#241D20] border border-[#443337] hover:border-[#B77D89]/60 text-[#F4EDE8] text-[13px] font-medium font-inter transition-all duration-200 shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#B77D89]">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              DM on Instagram
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2.5 rounded-xl border border-[#443337] bg-[#1C1719] text-[#F4EDE8] hover:border-[#B77D89] transition-all duration-300"
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
              className="absolute inset-0 bg-[#141112]/98 backdrop-blur-xl"
              onClick={() => setMobileOpen(false)}
            />
            <nav className="relative z-10 flex flex-col items-center justify-center h-full gap-2 pb-24">
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      delay: i * 0.05,
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={cn(
                      "text-2xl font-serif font-normal transition-colors duration-200 py-3 px-8 rounded-full w-[260px] text-center",
                      isActive
                        ? "text-[#F4EDE8] bg-[#1C1719] border border-[#443337]"
                        : "text-[#B9ADAA] hover:text-[#F4EDE8]"
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
                transition={{ delay: 0.3, duration: 0.35 }}
                className="inline-flex items-center gap-2 px-6 py-3 mt-8 rounded-full bg-[#F4EDE8] text-[#141112] text-sm font-semibold font-inter shadow-md hover:bg-white"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#87535F]">
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

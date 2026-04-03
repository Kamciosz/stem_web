"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import SlideMenu from "./SlideMenu";

const ease = [0.4, 0, 0.2, 1] as const;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const openMenu = useCallback(() => setIsMenuOpen(true), []);

  // When hovering on logo: start timer → auto-open menu after delay
  useEffect(() => {
    if (!isHovering || isMenuOpen) return;

    const storageKey = "stem-menu-auto-opened";
    const alreadyOpened = sessionStorage.getItem(storageKey);

    const isHomepage = pathname === "/" || pathname === "/pl" || pathname === "/en";
    const delay = isHomepage ? 5000 : 3000;

    // If already auto-opened this session, still allow hover-hold to open
    timerRef.current = setTimeout(() => {
      if (!alreadyOpened) sessionStorage.setItem(storageKey, "1");
      openMenu();
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isHovering, isMenuOpen, pathname, openMenu]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center px-8 py-5 md:px-12 md:py-6 bg-white/[0.02] backdrop-blur-xl border-b border-white/[0.04]" style={{ WebkitBackdropFilter: 'blur(30px) saturate(1.6)' }}>
          {/* Logo with hover-triggered underline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease }}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => {
              setIsHovering(false);
              if (timerRef.current) clearTimeout(timerRef.current);
            }}
            className="cursor-pointer"
          >
            <Link
              href="/"
              className="relative flex items-center gap-2"
            >
              <span className="text-lg md:text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
                STEM
              </span>
              <span className="text-lg md:text-xl font-light text-[var(--color-purple-400)]">
                ×
              </span>
              <span className="text-lg md:text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
                TEB Technikum
              </span>

              {/* Underline — expands on hover, retracts on leave */}
              <motion.span
                className="absolute -bottom-1.5 left-0 h-[2px] bg-gradient-to-r from-[var(--color-purple-600)] via-[var(--color-purple-400)] to-transparent"
                animate={{ width: isHovering ? "100%" : "0%" }}
                transition={{ duration: isHovering ? 1.2 : 0.6, ease }}
              />
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Slide-in Sidebar Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <SlideMenu onClose={() => setIsMenuOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

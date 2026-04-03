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
  const isHomepage = pathname === "/" || pathname === "/pl" || pathname === "/en";
  const hoverDelayMs = isHomepage ? 5000 : 3000;

  const openMenu = useCallback(() => setIsMenuOpen(true), []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleMouseEnter() {
    if (isMenuOpen) return;
    setIsHovering(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      openMenu();
      setIsHovering(false);
    }, hoverDelayMs);
  }

  function handleMouseLeave() {
    setIsHovering(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  return (
    <>
      <header className="fixed top-4 left-4 z-40 md:top-6 md:left-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative"
        >
          <button
            type="button"
            onClick={openMenu}
            className="relative flex items-center gap-2 rounded-xl border border-white/10 bg-black/35 px-4 py-2 backdrop-blur-xl transition-colors hover:border-white/20"
            style={{ WebkitBackdropFilter: "blur(24px) saturate(1.5)" }}
            aria-label="Otwórz menu"
          >
            <span className="text-sm md:text-base font-bold tracking-tight text-[var(--color-text-primary)]">
              STEM
            </span>
            <span className="text-sm md:text-base font-bold tracking-tight text-[var(--color-text-primary)]">
              x TEB Technikum
            </span>

            {/* Underline fills exactly for 5s/3s and resets on leave. */}
            <motion.span
              className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-[var(--color-purple-600)] via-[var(--color-purple-400)] to-transparent"
              animate={{ width: isHovering ? "100%" : "0%" }}
              transition={{ duration: isHovering ? hoverDelayMs / 1000 : 0.22, ease: isHovering ? "linear" : ease }}
            />
          </button>

          <Link href="/" className="sr-only">
            Strona główna
          </Link>
        </motion.div>
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

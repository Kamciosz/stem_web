"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SlideMenu from "./SlideMenu";

const ease = [0.4, 0, 0.2, 1] as const;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverDelayMs = 2500;

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
          className="relative cursor-pointer"
          onClick={openMenu}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openMenu();
            }
          }}
          aria-label="Otworz menu"
        >
          <div className="relative flex items-center gap-1.5 rounded-lg bg-black/15 px-2 py-1.5 backdrop-blur-md md:px-2.5">
            <span className="text-sm md:text-[15px] font-semibold tracking-tight text-[var(--color-text-primary)]">
              STEM
            </span>
            <span className="text-sm md:text-[15px] font-light text-[var(--color-purple-400)]">
              x
            </span>
            <span className="text-sm md:text-[15px] font-semibold tracking-tight text-[var(--color-text-primary)]">
              TEB Technikum
            </span>

            {/* Underline fills over the same delay as menu auto-open. */}
            <motion.span
              className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-[var(--color-purple-600)] via-[var(--color-purple-400)] to-transparent"
              animate={{ width: isHovering ? "100%" : "0%" }}
              transition={{ duration: isHovering ? hoverDelayMs / 1000 : 0.22, ease: isHovering ? "linear" : ease }}
            />
          </div>
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

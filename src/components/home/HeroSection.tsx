"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const t = useTranslations("hero");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  return (
    <section
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden stone-texture vignette"
    >
      {/* Background gradient layers */}
      <motion.div
        className="absolute inset-0"
        style={{ y }}
      >
        {/* Deep purple radial glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-purple-950)]/30 via-[var(--color-bg-primary)] to-[var(--color-bg-primary)]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-purple-700)]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-bg-primary)] to-transparent" />
      </motion.div>

      {/* Floating orbs — depth layer 1 (behind content) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 80]) }}
      >
        <div className="absolute top-[15%] left-[10%] w-64 h-64 bg-[var(--color-purple-600)]/8 rounded-full blur-[100px] animate-[glow-pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-[60%] right-[15%] w-48 h-48 bg-[var(--color-purple-500)]/6 rounded-full blur-[80px] animate-[glow-pulse_6s_ease-in-out_infinite_2s]" />
        <div className="absolute bottom-[20%] left-[40%] w-72 h-72 bg-[var(--color-purple-800)]/5 rounded-full blur-[120px] animate-[glow-pulse_10s_ease-in-out_infinite_4s]" />
      </motion.div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(139, 69, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 69, 255, 0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6"
        style={{ opacity, scale }}
      >
        {/* Decorative line */}
        <motion.div
          className="w-px h-16 mb-8 rounded-full"
          style={{ background: "linear-gradient(to bottom, transparent, #8b45ff, transparent)" }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Subtitle */}
        <motion.p
          className="text-sm md:text-base tracking-[0.3em] uppercase text-[var(--color-purple-400)] font-medium mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {t("subtitle")}
        </motion.p>

        {/* Main title */}
        <motion.h1
          className="text-6xl md:text-8xl lg:text-9xl font-extralight tracking-tight mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <span className="gradient-text">STEM</span>
          <span className="text-[var(--color-purple-400)] mx-3 md:mx-4 font-extralight">×</span>
          <span className="text-[var(--color-text-primary)]">TEB</span>
        </motion.h1>

        {/* School name */}
        <motion.p
          className="text-lg md:text-xl text-[var(--color-text-secondary)] font-light tracking-wide mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          {t("school")}
        </motion.p>

        {/* CTA button */}
        <motion.a
          href="#about"
          className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--color-purple-600)] hover:bg-[var(--color-purple-500)] text-white font-medium transition-all duration-300 glow-purple"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {t("cta")}
          <ChevronDown
            size={18}
            className="group-hover:translate-y-0.5 transition-transform"
          />
        </motion.a>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-xs tracking-widest uppercase text-[var(--color-text-muted)]">
          {t("scroll")}
        </span>
        <motion.div
          className="w-5 h-8 rounded-full border border-[var(--color-border)] flex justify-center pt-1.5"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 rounded-full bg-[var(--color-purple-500)]"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

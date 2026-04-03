"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Cpu, Cog, Code, Sparkles } from "lucide-react";

const pillars = [
  {
    key: "robotics",
    titleKey: "robotics",
    descKey: "roboticsDesc",
    icon: Cpu,
    gradient: "from-purple-500 to-blue-500",
  },
  {
    key: "mechatronics",
    titleKey: "mechatronics",
    descKey: "mechatronicsDesc",
    icon: Cog,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    key: "programming",
    titleKey: "programming",
    descKey: "programmingDesc",
    icon: Code,
    gradient: "from-purple-500 to-emerald-500",
  },
];

export default function AboutSection() {
  const t = useTranslations("about");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-24 md:py-32 stone-texture"
    >
      {/* Decorative background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-purple-700)]/4 rounded-full blur-[150px] pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles size={16} className="text-[var(--color-purple-400)]" />
            <span className="text-sm tracking-[0.2em] uppercase text-[var(--color-purple-400)] font-medium">
              {t("futureEngineers")}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text">
            {t("title")}
          </h2>
          <p className="max-w-2xl mx-auto text-[var(--color-text-secondary)] text-lg leading-relaxed">
            {t("description")}
          </p>
        </motion.div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.key}
              className="glass-card rounded-2xl p-8 text-center group gradient-border"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.15, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.4 } }}
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-accent-subtle)] mb-6 group-hover:scale-110 transition-transform duration-300">
                <pillar.icon
                  size={28}
                  className="text-[var(--color-purple-400)]"
                />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
                {t(pillar.titleKey)}
              </h3>

              {/* Description */}
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                {t(pillar.descKey)}
              </p>

              {/* Decorative bottom line */}
              <motion.div
                className={`h-1 w-12 mx-auto mt-6 rounded-full bg-gradient-to-r ${pillar.gradient} opacity-50 group-hover:opacity-100 group-hover:w-20 transition-all duration-300`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

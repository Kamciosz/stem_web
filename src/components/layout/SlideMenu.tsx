"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { Globe, GitFork, X, Home, FolderOpen, Handshake, Mail } from "lucide-react";

interface SlideMenuProps {
  onClose: () => void;
}

const ease = [0.4, 0, 0.2, 1] as const;

const sidebarVariants = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: { duration: 0.32, ease, staggerChildren: 0.04, delayChildren: 0.04 },
  },
  exit: {
    x: "-100%",
    transition: { duration: 0.24, ease },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease } },
  exit: { opacity: 0, transition: { duration: 0.3, ease } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease } },
  exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
};

const navIcons = [Home, FolderOpen, Handshake, Mail];

export default function SlideMenu({ onClose }: SlideMenuProps) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { href: "/" as const, label: t("home") },
    { href: "/projekty" as const, label: t("projects") },
    { href: "/partnerzy" as const, label: t("partners") },
    { href: "/kontakt" as const, label: t("contact") },
  ];

  function switchLocale() {
    const newLocale = locale === "pl" ? "en" : "pl";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace(pathname as any, { locale: newLocale });
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      />

      {/* Sidebar panel — liquid glass */}
      <motion.nav
        className="fixed top-0 left-0 z-50 h-full w-80 flex flex-col bg-white/[0.03] backdrop-blur-[40px] backdrop-saturate-[1.8] border-r border-white/[0.08]"
        style={{ WebkitBackdropFilter: 'blur(40px) saturate(1.8)' }}
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header with close */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/[0.06]">
          <span className="text-sm font-semibold tracking-widest uppercase text-[var(--color-purple-400)]">
            Menu
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors duration-300"
            aria-label="Zamknij menu"
          >
            <X size={20} className="text-[var(--color-text-secondary)]" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 flex flex-col gap-1 px-4 py-6">
          {navItems.map((item, i) => {
            const Icon = navIcons[i];
            return (
              <motion.div key={item.href} variants={itemVariants}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-accent-subtle)] transition-all duration-300 group"
                >
                  <Icon size={20} className="text-[var(--color-purple-400)] opacity-60 group-hover:opacity-100 transition-opacity" />
                  {item.label}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom section — language + social */}
        <motion.div
          className="px-6 py-6 border-t border-white/[0.06] flex items-center gap-4"
          variants={itemVariants}
        >
          <button
            onClick={switchLocale}
            className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors duration-300"
          >
            <Globe size={16} />
            <span>{t("language")}</span>
          </button>

          <span className="w-px h-4 bg-[var(--color-border)]" />

          <a
            href="https://github.com/Kamciosz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-purple-400)] transition-colors duration-300"
          >
            <GitFork size={16} />
          </a>
        </motion.div>
      </motion.nav>
    </>
  );
}

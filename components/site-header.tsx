'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Start" },
  { href: "/projects", label: "Projekty" },
  { href: "/adminpanel", label: "Admin" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-[#1e1e2e]' : 'bg-transparent'}`}>
      <div className="content-wrap flex h-16 items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          STEM <span className="text-[#a78bfa]">x</span> TEB
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium transition-all hover:bg-[#1e1e2e] hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

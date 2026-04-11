/*
 * PartnersCarousel — Marquee z logami partnerów
 *
 * DANE: Pobierane z Supabase (tabela `partners` WHERE is_visible = true).
 * Gdy brak partnerów → wyświetla komunikat "Wkrótce ogłosimy partnerów".
 *
 * JAK DODAĆ PARTNERÓW:
 * 1. Przejdź do /admin/partnerzy
 * 2. Kliknij "Dodaj partnera"
 * 3. Wypełnij: nazwa, logo (upload lub URL), link do strony, opis
 * 4. Ustaw is_visible = true → partner pojawi się automatycznie na stronie
 *
 * JAK EDYTOWAĆ:
 * - /admin/partnerzy → kliknij na partnera → edytuj pola
 * - Zmiana display_order zmienia kolejność w karuzeli
 * - Ustawienie is_visible = false ukryje partnera bez usuwania
 *
 * JAK PRZYWRÓCIĆ PLACEHOLDERY (dev):
 * - Odkomentuj PLACEHOLDER_PARTNERS poniżej
 * - Użyj ich jako fallback zamiast pustej tablicy
 */

"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Handshake } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Partner } from "@/types/database";

// Uncomment for development placeholders:
// const PLACEHOLDER_PARTNERS = [
//   { id: "a", name: "Partner A", logo_url: "", website_url: null },
//   { id: "b", name: "Partner B", logo_url: "", website_url: null },
// ];

function PartnerLogo({ partner }: { partner: Partner }) {
  const inner = partner.logo_url ? (
    // rule disabled: external images handled by simple <img> wrapper to avoid
    // adding Next.js Image loader config for many external domains during dev
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={partner.logo_url}
      alt={partner.name}
      className="max-h-16 max-w-full object-contain"
    />
  ) : (
    <span className="text-base font-semibold text-white/90 tracking-wide">
      {partner.name}
    </span>
  );

  const wrapper = (
    <div className="flex-shrink-0 flex items-center justify-center w-56 h-24 rounded-2xl bg-white/[0.04] border border-white/[0.06] opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
      {inner}
    </div>
  );

  if (partner.website_url) {
    return (
      <a href={partner.website_url} target="_blank" rel="noopener noreferrer">
        {wrapper}
      </a>
    );
  }

  return wrapper;
}

export default function PartnersCarousel() {
  const t = useTranslations("partners");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("partners")
          .select("*")
          .eq("is_visible", true)
          .order("display_order");

        setPartners(data ?? []);
      } catch {
        // Supabase not configured yet — show empty state
        setPartners([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPartners();
  }, []);

  if (loading) return null;

  return (
    <section ref={ref} className="relative py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-[var(--color-text-secondary)]">
            {t("subtitle")}
          </h3>
        </motion.div>

        {partners.length === 0 ? (
          /* No partners yet — friendly message */
          <motion.div
            className="text-center py-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Handshake
              size={40}
              className="mx-auto mb-4 text-[var(--color-purple-400)] opacity-40"
            />
            <p className="text-[var(--color-text-muted)] text-sm">
              {t("noPartners")}
            </p>
          </motion.div>
        ) : (
          /* CSS-based infinite marquee */
          <div className="relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[var(--color-bg-primary)] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[var(--color-bg-primary)] to-transparent z-10 pointer-events-none" />

            <div className="marquee">
              <div className="marquee-track">
                {partners.map((p) => (
                  <PartnerLogo key={p.id} partner={p} />
                ))}
              </div>
              <div className="marquee-track" aria-hidden="true">
                {partners.map((p) => (
                  <PartnerLogo key={`dup-${p.id}`} partner={p} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

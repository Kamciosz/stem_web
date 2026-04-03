"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Handshake, ExternalLink } from "lucide-react";

const MOCK_PARTNERS: {
    id: string;
    name: string;
    logo_url: string;
    website_url: string | null;
    description_pl: string | null;
    description_en: string | null;
}[] = [];

export default function PartnersPageView() {
    const t = useTranslations("partners");
    const locale = useLocale();
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    const partners = MOCK_PARTNERS;

    return (
        <div ref={ref} className="min-h-screen pt-28 pb-20 stone-texture">
            <div className="mx-auto max-w-7xl px-6 md:px-10">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Handshake
                            size={20}
                            className="text-[var(--color-purple-400)]"
                        />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
                        {t("title")}
                    </h1>
                    <p className="text-lg text-[var(--color-text-secondary)]">
                        {t("subtitle")}
                    </p>
                </motion.div>

                {partners.length === 0 ? (
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="glass-card rounded-2xl p-12 max-w-lg mx-auto">
                            <Handshake
                                size={48}
                                className="text-[var(--color-purple-700)] mx-auto mb-4"
                            />
                            <p className="text-[var(--color-text-muted)] text-lg">
                                {t("noPartners")}
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {partners.map((partner, index) => (
                            <motion.div
                                key={partner.id}
                                className="glass-card rounded-2xl p-8 text-center group"
                                initial={{ opacity: 0, y: 40 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.1 * index }}
                                whileHover={{ y: -6 }}
                            >
                                <img
                                    src={partner.logo_url}
                                    alt={partner.name}
                                    className="h-16 mx-auto mb-6 object-contain grayscale group-hover:grayscale-0 transition-all"
                                />
                                <h3 className="text-lg font-semibold mb-2 text-[var(--color-text-primary)]">
                                    {partner.name}
                                </h3>
                                <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                                    {locale === "en" && partner.description_en
                                        ? partner.description_en
                                        : partner.description_pl}
                                </p>
                                {partner.website_url && (
                                    <a
                                        href={partner.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-purple-400)] hover:text-[var(--color-purple-300)] transition-colors"
                                    >
                                        <ExternalLink size={14} />
                                        Website
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

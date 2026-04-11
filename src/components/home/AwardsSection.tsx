"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Trophy } from "lucide-react";

export default function AwardsSection() {
    const t = useTranslations("awards");
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    // Mock awards — will be replaced with Supabase data
    // When empty, the section is hidden
    const awards: { id: string; title: string; date: string; image_url: string }[] = [];

    if (awards.length === 0) return null;

    return (
        <section ref={ref} className="relative py-20 md:py-32">
            <div className="mx-auto max-w-7xl px-6 md:px-10">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Trophy size={18} className="text-[var(--color-purple-400)]" />
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold gradient-text">
                        {t("title")}
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {awards.map((award, index) => (
                        <motion.div
                            key={award.id}
                            className="glass-card rounded-2xl p-6 text-center"
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            {award.image_url && (
                                <img
                                    src={award.image_url}
                                    alt={award.title}
                                    className="w-16 h-16 mx-auto mb-4 object-contain"
                                />
                            )}
                            <h3 className="font-semibold text-[var(--color-text-primary)]">
                                {award.title}
                            </h3>
                            {award.date && (
                                <p className="text-sm text-[var(--color-text-muted)] mt-1">{award.date}</p>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

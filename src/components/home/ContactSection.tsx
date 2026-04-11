"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle, AlertCircle, Mail, MapPin, Building } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Imię jest wymagane").max(100),
  email: z.string().email("Nieprawidłowy email").max(200),
  company: z.string().max(200).optional(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, "Wiadomość musi mieć min. 10 znaków").max(5000),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const t = useTranslations("contact");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    setSubmitState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setSubmitState("success");
      reset();
      setTimeout(() => setSubmitState("idle"), 5000);
    } catch {
      setSubmitState("error");
      setTimeout(() => setSubmitState("idle"), 5000);
    }
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-20 md:py-32 stone-texture"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          >
            <span className="text-sm tracking-[0.2em] uppercase text-[var(--color-purple-400)] font-medium">
              {t("subtitle")}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-6 gradient-text">
              {t("title")}
            </h2>

            <div className="space-y-6 text-[var(--color-text-secondary)]">
              <div className="flex items-start gap-4">
                <div className="p-4 rounded-xl bg-[var(--color-accent-subtle)]">
                  <Building size={24} className="text-[var(--color-purple-300)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--color-text-primary)]">TEB Technikum</p>
                  <p className="text-sm">{t("businessInfo")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-4 rounded-xl bg-[var(--color-accent-subtle)]">
                  <MapPin size={24} className="text-[var(--color-purple-300)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--color-text-primary)]">{t("location")}</p>
                  <p className="text-sm">{t("address")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-4 rounded-xl bg-[var(--color-accent-subtle)]">
                  <Mail size={24} className="text-[var(--color-purple-300)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--color-text-primary)]">Email</p>
                  <p className="text-sm">kontakt@stem.pl</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="glass-card rounded-2xl p-8 space-y-5 relative"
            >
              {/* Glow behind form */}
              <div className="absolute -inset-4 bg-[var(--color-purple-600)]/3 rounded-3xl blur-2xl pointer-events-none" />
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
                >
                  {t("name")}
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-primary)] border border-white/10 hover:border-white/20 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-purple-500)] transition-colors input-depth"
                />
                {errors.name && (
                  <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
                >
                  {t("email")}
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-primary)] border border-white/10 hover:border-white/20 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-purple-500)] transition-colors input-depth"
                />
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Company */}
              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
                >
                  {t("company")}
                </label>
                <input
                  id="company"
                  type="text"
                  {...register("company")}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-primary)] border border-white/10 hover:border-white/20 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-purple-500)] transition-colors input-depth"
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
                >
                  {t("subject")}
                </label>
                <input
                  id="subject"
                  type="text"
                  {...register("subject")}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-primary)] border border-white/10 hover:border-white/20 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-purple-500)] transition-colors input-depth"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
                >
                  {t("message")}
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register("message")}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-primary)] border border-white/10 hover:border-white/20 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-purple-500)] transition-colors resize-none input-depth"
                />
                {errors.message && (
                  <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitState === "loading"}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-purple-600)] hover:bg-[var(--color-purple-500)] disabled:opacity-60 text-white font-medium transition-all duration-300 glow-purple"
              >
                {submitState === "loading" ? (
                  <>{t("sending")}</>
                ) : (
                  <>
                    <Send size={18} />
                    {t("send")}
                  </>
                )}
              </button>

              {/* Status messages */}
              {submitState === "success" && (
                <motion.div
                  className="flex items-center gap-2 text-green-400 text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CheckCircle size={16} />
                  {t("success")}
                </motion.div>
              )}
              {submitState === "error" && (
                <motion.div
                  className="flex items-center gap-2 text-red-400 text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle size={16} />
                  {t("error")}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

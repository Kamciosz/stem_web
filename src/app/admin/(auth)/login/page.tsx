"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Lock, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const canUseSupabase = Boolean(supabaseUrl && supabaseAnonKey);

    const supabase = canUseSupabase
        ? createBrowserClient(supabaseUrl!, supabaseAnonKey!)
        : null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!supabase) {
            setError("Brak konfiguracji Supabase na środowisku produkcyjnym.");
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        router.push("/admin");
        router.refresh();
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--color-bg-primary)]">
            <div className="w-full max-w-md px-6">
                <div className="glass-card rounded-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-purple-500)] to-[var(--color-purple-800)] flex items-center justify-center mx-auto mb-4 glow-purple">
                            <Lock size={28} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold gradient-text">
                            Panel Administracyjny
                        </h1>
                        <p className="text-sm text-[var(--color-text-muted)] mt-2">
                            STEM × TEB Technikum
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!canUseSupabase && (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
                                <AlertCircle size={16} />
                                Brakuje zmiennych SUPABASE na Vercelu.
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-purple-500)] focus:outline-none focus:ring-1 focus:ring-[var(--color-purple-500)] transition-colors"
                                placeholder="admin@teb.pl"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
                            >
                                Hasło
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-purple-500)] focus:outline-none focus:ring-1 focus:ring-[var(--color-purple-500)] transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !canUseSupabase}
                            className="w-full py-3 rounded-xl bg-[var(--color-purple-600)] hover:bg-[var(--color-purple-500)] disabled:bg-[var(--color-purple-800)] disabled:cursor-not-allowed text-white font-medium transition-all duration-300 glow-purple"
                        >
                            {loading ? "Logowanie..." : "Zaloguj się"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

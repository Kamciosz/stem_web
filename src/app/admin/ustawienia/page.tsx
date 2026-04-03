"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Save, Loader2 } from "lucide-react";
import type { SiteSetting } from "@/types/database";

interface SettingsMap {
    [key: string]: string;
}

const SETTINGS_SCHEMA = [
    {
        group: "Strona główna",
        fields: [
            { key: "homepage_projects_count", label: "Liczba projektów na stronie głównej", type: "number" },
        ],
    },
    {
        group: "SEO",
        fields: [
            { key: "site_title", label: "Tytuł strony", type: "text" },
            { key: "site_description", label: "Opis strony", type: "textarea" },
        ],
    },
    {
        group: "Social Media",
        fields: [
            { key: "github_url", label: "GitHub URL", type: "url" },
            { key: "instagram_url", label: "Instagram URL", type: "url" },
            { key: "discord_url", label: "Discord URL", type: "url" },
            { key: "email", label: "Email kontaktowy", type: "email" },
        ],
    },
];

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<SettingsMap>({});
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        supabase
            .from("site_settings")
            .select("*")
            .then(({ data }) => {
                if (data) {
                    const map: SettingsMap = {};
                    (data as SiteSetting[]).forEach((s) => {
                        map[s.key] = String(s.value ?? "");
                    });
                    setSettings(map);
                }
            });
    }, []);

    function handleChange(key: string, value: string) {
        setSettings((prev) => ({ ...prev, [key]: value }));
        setSaved(false);
    }

    async function handleSave() {
        setLoading(true);

        const upserts = Object.entries(settings).map(([key, value]) => ({
            key,
            value,
        }));

        await supabase.from("site_settings").upsert(upserts, { onConflict: "key" });

        setLoading(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    return (
        <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold gradient-text">Ustawienia</h1>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-purple-600)] hover:bg-[var(--color-purple-700)] text-white font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Save size={18} />
                    )}
                    {saved ? "Zapisano!" : "Zapisz"}
                </button>
            </div>

            <div className="space-y-8">
                {SETTINGS_SCHEMA.map((group) => (
                    <div key={group.group} className="glass-card rounded-2xl p-6">
                        <h2 className="text-lg font-semibold mb-4">{group.group}</h2>
                        <div className="space-y-4">
                            {group.fields.map((field) => (
                                <div key={field.key}>
                                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                                        {field.label}
                                    </label>
                                    {field.type === "textarea" ? (
                                        <textarea
                                            value={settings[field.key] ?? ""}
                                            onChange={(e) => handleChange(field.key, e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] focus:border-[var(--color-purple-500)] focus:outline-none transition-colors"
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            value={settings[field.key] ?? ""}
                                            onChange={(e) => handleChange(field.key, e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] focus:border-[var(--color-purple-500)] focus:outline-none transition-colors"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

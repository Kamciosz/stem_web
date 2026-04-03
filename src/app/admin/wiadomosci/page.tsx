"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import type { ContactMessage } from "@/types/database";

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [selected, setSelected] = useState<ContactMessage | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        supabase
            .from("contact_messages")
            .select("*")
            .order("created_at", { ascending: false })
            .then(({ data }) => {
                if (data) setMessages(data as ContactMessage[]);
            });
    }, []);

    async function markAsRead(msg: ContactMessage) {
        if (!msg.is_read) {
            await supabase
                .from("contact_messages")
                .update({ is_read: true })
                .eq("id", msg.id);
            setMessages((prev) =>
                prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
            );
        }
        setSelected(msg);
    }

    async function handleDelete(id: string) {
        if (!confirm("Usunąć wiadomość?")) return;
        await supabase.from("contact_messages").delete().eq("id", id);
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selected?.id === id) setSelected(null);
    }

    const unreadCount = messages.filter((m) => !m.is_read).length;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold gradient-text">Wiadomości</h1>
                {unreadCount > 0 && (
                    <span className="px-3 py-1 rounded-full bg-[var(--color-purple-600)]/20 text-[var(--color-purple-400)] text-sm font-medium">
                        {unreadCount} nieprzeczytanych
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Messages list */}
                <div className="lg:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto pr-2">
                    {messages.length === 0 && (
                        <p className="text-[var(--color-text-muted)] text-center py-12">
                            Brak wiadomości
                        </p>
                    )}
                    {messages.map((msg) => (
                        <button
                            key={msg.id}
                            onClick={() => markAsRead(msg)}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${selected?.id === msg.id
                                    ? "border-[var(--color-purple-500)] bg-[var(--color-purple-600)]/10"
                                    : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                                }`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                    {msg.is_read ? (
                                        <MailOpen size={16} className="shrink-0 text-[var(--color-text-muted)]" />
                                    ) : (
                                        <Mail size={16} className="shrink-0 text-[var(--color-purple-400)]" />
                                    )}
                                    <span
                                        className={`truncate text-sm ${msg.is_read ? "text-[var(--color-text-muted)]" : "font-semibold"
                                            }`}
                                    >
                                        {msg.name}
                                    </span>
                                </div>
                                <span className="text-xs text-[var(--color-text-muted)] shrink-0">
                                    {new Date(msg.created_at).toLocaleDateString("pl-PL")}
                                </span>
                            </div>
                            <p className="text-xs text-[var(--color-text-muted)] mt-1 truncate">
                                {msg.email}
                            </p>
                            <p
                                className={`text-sm mt-1 truncate ${msg.is_read ? "text-[var(--color-text-muted)]" : ""
                                    }`}
                            >
                                {msg.message}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Message detail */}
                <div className="lg:col-span-3 glass-card rounded-2xl p-6 min-h-[50vh]">
                    {selected ? (
                        <>
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold">{selected.name}</h2>
                                    <a
                                        href={`mailto:${selected.email}`}
                                        className="text-[var(--color-purple-400)] text-sm hover:underline"
                                    >
                                        {selected.email}
                                    </a>
                                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                        {new Date(selected.created_at).toLocaleString("pl-PL")}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(selected.id)}
                                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div className="whitespace-pre-wrap text-[var(--color-text-secondary)] leading-relaxed">
                                {selected.message}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-[var(--color-text-muted)]">
                            Wybierz wiadomość
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

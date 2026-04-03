import {
    FolderKanban,
    UsersRound,
    Users,
    Handshake,
    Trophy,
    Mail,
} from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function getStats() {
    const supabase = await createServerSupabaseClient();

    const [projects, members, groups, partners, messages] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("members").select("id", { count: "exact", head: true }),
        supabase.from("groups").select("id", { count: "exact", head: true }),
        supabase.from("partners").select("id", { count: "exact", head: true }),
        supabase
            .from("contact_messages")
            .select("id", { count: "exact", head: true })
            .eq("is_read", false),
    ]);

    return {
        projects: projects.count ?? 0,
        members: members.count ?? 0,
        groups: groups.count ?? 0,
        partners: partners.count ?? 0,
        unreadMessages: messages.count ?? 0,
    };
}

const STAT_CARDS = [
    { key: "projects", label: "Projekty", icon: FolderKanban, href: "/admin/projekty" },
    { key: "members", label: "Członkowie", icon: UsersRound, href: "/admin/czlonkowie" },
    { key: "groups", label: "Grupy", icon: Users, href: "/admin/grupy" },
    { key: "partners", label: "Partnerzy", icon: Handshake, href: "/admin/partnerzy" },
    { key: "unreadMessages", label: "Nieprzeczytane", icon: Mail, href: "/admin/wiadomosci" },
    { key: "awards", label: "Nagrody", icon: Trophy, href: "/admin/nagrody" },
] as const;

export default async function AdminDashboard() {
    let stats: Record<string, number> = {};

    try {
        stats = await getStats();
    } catch {
        // Supabase not configured yet — show zeros
        stats = { projects: 0, members: 0, groups: 0, partners: 0, unreadMessages: 0, awards: 0 };
    }

    return (
        <div>
            <h1 className="text-3xl font-bold gradient-text mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {STAT_CARDS.map((card) => {
                    const Icon = card.icon;
                    const count = stats[card.key] ?? 0;
                    return (
                        <a
                            key={card.key}
                            href={card.href}
                            className="glass-card rounded-2xl p-6 group hover:border-[var(--color-border-hover)] transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-[var(--color-purple-600)]/15">
                                    <Icon
                                        size={22}
                                        className="text-[var(--color-purple-400)]"
                                    />
                                </div>
                                <span className="text-3xl font-bold text-[var(--color-text-primary)]">
                                    {count}
                                </span>
                            </div>
                            <p className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
                                {card.label}
                            </p>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

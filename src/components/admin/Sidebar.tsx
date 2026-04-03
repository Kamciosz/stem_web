"use client";

import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
    LayoutDashboard,
    FolderKanban,
    UsersRound,
    Users,
    Handshake,
    Trophy,
    Mail,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/projekty", label: "Projekty", icon: FolderKanban },
    { href: "/admin/czlonkowie", label: "Członkowie", icon: UsersRound },
    { href: "/admin/grupy", label: "Grupy", icon: Users },
    { href: "/admin/partnerzy", label: "Partnerzy", icon: Handshake },
    { href: "/admin/nagrody", label: "Nagrody", icon: Trophy },
    { href: "/admin/wiadomosci", label: "Wiadomości", icon: Mail },
    { href: "/admin/ustawienia", label: "Ustawienia", icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    if (pathname.startsWith("/admin/login")) {
        return null;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const canUseSupabase = Boolean(supabaseUrl && supabaseAnonKey);

    const supabase = canUseSupabase
        ? createBrowserClient(supabaseUrl!, supabaseAnonKey!)
        : null;

    async function handleLogout() {
        document.cookie = "stem_admin_bypass=; Path=/; Max-Age=0; SameSite=Lax";
        if (supabase) {
            await supabase.auth.signOut();
        }
        router.push("/admin/login");
        router.refresh();
    }

    function isActive(href: string) {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    }

    return (
        <aside
            className={`${collapsed ? "w-[72px]" : "w-64"
                } h-screen fixed left-0 top-0 bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] flex flex-col transition-all duration-300 z-50`}
        >
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
                {!collapsed && (
                    <span className="text-sm font-bold gradient-text whitespace-nowrap">
                        STEM Admin
                    </span>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-lg hover:bg-[var(--color-accent-subtle)] text-[var(--color-text-muted)] transition-colors"
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                        <a
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active
                                ? "bg-[var(--color-purple-600)]/20 text-[var(--color-purple-300)] border border-[var(--color-purple-600)]/30"
                                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-text-primary)]"
                                }`}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon size={18} className="flex-shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </a>
                    );
                })}
            </nav>

            <div className="border-t border-[var(--color-border)] p-3">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                    title={collapsed ? "Wyloguj" : undefined}
                >
                    <LogOut size={18} className="flex-shrink-0" />
                    {!collapsed && <span>Wyloguj</span>}
                </button>
            </div>
        </aside>
    );
}

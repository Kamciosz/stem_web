"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import DataTable, { type Column } from "@/components/admin/DataTable";
import type { Member } from "@/types/database";

const columns: Column<Member>[] = [
    {
        key: "name",
        label: "Imię i nazwisko",
        sortable: true,
        render: (val, row) => (
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-purple-500)] to-[var(--color-purple-800)] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {String(val).charAt(0)}
                </div>
                <div>
                    <span className="text-[var(--color-text-primary)] font-medium">
                        {String(val)}
                    </span>
                    {row.nickname && (
                        <span className="text-[var(--color-text-muted)] ml-1.5">
                            ({row.nickname})
                        </span>
                    )}
                </div>
            </div>
        ),
    },
    { key: "role", label: "Rola", sortable: true },
    {
        key: "is_visible",
        label: "Widoczny",
        render: (val) => (val ? "✓" : "✗"),
    },
    { key: "display_order", label: "Kolejność", sortable: true },
];

export default function AdminMembersPage() {
    const [members, setMembers] = useState<Member[]>([]);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        supabase
            .from("members")
            .select("*")
            .order("display_order")
            .then(({ data }) => {
                if (data) setMembers(data as Member[]);
            });
    }, []);

    async function handleDelete(id: string) {
        await supabase.from("members").delete().eq("id", id);
        setMembers((prev) => prev.filter((m) => m.id !== id));
    }

    return (
        <DataTable
            title="Członkowie"
            columns={columns}
            data={members}
            createHref="/admin/czlonkowie/new"
            editHref={(row) => `/admin/czlonkowie/${row.id}`}
            onDelete={handleDelete}
        />
    );
}

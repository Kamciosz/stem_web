"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import DataTable, { type Column } from "@/components/admin/DataTable";
import type { Group } from "@/types/database";

const columns: Column<Group>[] = [
    { key: "name", label: "Nazwa", sortable: true },
    {
        key: "is_permanent",
        label: "Typ",
        render: (val) => (
            <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${val
                        ? "bg-[var(--color-purple-600)]/15 text-[var(--color-purple-400)]"
                        : "bg-blue-500/15 text-blue-400"
                    }`}
            >
                {val ? "Stała" : "Tymczasowa"}
            </span>
        ),
    },
    {
        key: "is_visible",
        label: "Widoczna",
        render: (val) => (val ? "✓" : "✗"),
    },
];

export default function AdminGroupsPage() {
    const [groups, setGroups] = useState<Group[]>([]);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        supabase
            .from("groups")
            .select("*")
            .order("name")
            .then(({ data }) => {
                if (data) setGroups(data as Group[]);
            });
    }, []);

    async function handleDelete(id: string) {
        await supabase.from("groups").delete().eq("id", id);
        setGroups((prev) => prev.filter((g) => g.id !== id));
    }

    return (
        <DataTable
            title="Grupy"
            columns={columns}
            data={groups}
            createHref="/admin/grupy/new"
            editHref={(row) => `/admin/grupy/${row.id}`}
            onDelete={handleDelete}
        />
    );
}

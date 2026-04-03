"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import DataTable, { type Column } from "@/components/admin/DataTable";
import type { Partner } from "@/types/database";

const columns: Column<Partner>[] = [
    { key: "name", label: "Nazwa", sortable: true },
    {
        key: "type",
        label: "Typ",
        sortable: true,
        render: (val) => (
            <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${val === "partner"
                        ? "bg-[var(--color-purple-600)]/15 text-[var(--color-purple-400)]"
                        : "bg-yellow-500/15 text-yellow-400"
                    }`}
            >
                {val === "partner" ? "Partner" : "Sponsor"}
            </span>
        ),
    },
    { key: "tier", label: "Tier", render: (val) => String(val ?? "—") },
    {
        key: "is_visible",
        label: "Widoczny",
        render: (val) => (val ? "✓" : "✗"),
    },
    { key: "display_order", label: "Kolejność", sortable: true },
];

export default function AdminPartnersPage() {
    const [partners, setPartners] = useState<Partner[]>([]);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        supabase
            .from("partners")
            .select("*")
            .order("display_order")
            .then(({ data }) => {
                if (data) setPartners(data as Partner[]);
            });
    }, []);

    async function handleDelete(id: string) {
        await supabase.from("partners").delete().eq("id", id);
        setPartners((prev) => prev.filter((p) => p.id !== id));
    }

    return (
        <DataTable
            title="Partnerzy i Sponsorzy"
            columns={columns}
            data={partners}
            createHref="/admin/partnerzy/new"
            editHref={(row) => `/admin/partnerzy/${row.id}`}
            onDelete={handleDelete}
        />
    );
}

"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import DataTable, { type Column } from "@/components/admin/DataTable";
import type { Award } from "@/types/database";

const columns: Column<Award>[] = [
    { key: "title_pl", label: "Tytuł", sortable: true },
    {
        key: "date",
        label: "Data",
        sortable: true,
        render: (val) =>
            val ? new Date(String(val)).toLocaleDateString("pl-PL") : "—",
    },
    { key: "display_order", label: "Kolejność", sortable: true },
];

export default function AdminAwardsPage() {
    const [awards, setAwards] = useState<Award[]>([]);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        supabase
            .from("awards")
            .select("*")
            .order("display_order")
            .then(({ data }) => {
                if (data) setAwards(data as Award[]);
            });
    }, []);

    async function handleDelete(id: string) {
        await supabase.from("awards").delete().eq("id", id);
        setAwards((prev) => prev.filter((a) => a.id !== id));
    }

    return (
        <DataTable
            title="Nagrody i Certyfikaty"
            columns={columns}
            data={awards}
            createHref="/admin/nagrody/new"
            editHref={(row) => `/admin/nagrody/${row.id}`}
            onDelete={handleDelete}
        />
    );
}

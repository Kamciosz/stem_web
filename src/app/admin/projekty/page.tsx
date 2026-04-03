"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import DataTable, { type Column } from "@/components/admin/DataTable";
import type { Project } from "@/types/database";

const columns: Column<Project>[] = [
    { key: "title_pl", label: "Tytuł", sortable: true },
    {
        key: "category",
        label: "Kategoria",
        sortable: true,
        render: (val) => (
            <span className="category-pill">{String(val)}</span>
        ),
    },
    {
        key: "status",
        label: "Status",
        sortable: true,
        render: (val) => (
            <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${val === "published"
                        ? "bg-green-500/15 text-green-400"
                        : "bg-yellow-500/15 text-yellow-400"
                    }`}
            >
                {val === "published" ? "Opublikowany" : "Szkic"}
            </span>
        ),
    },
    {
        key: "is_featured",
        label: "Wyróżniony",
        render: (val) => (val ? "✓" : "—"),
    },
];

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        supabase
            .from("projects")
            .select("*")
            .order("display_order")
            .then(({ data }) => {
                if (data) setProjects(data as Project[]);
            });
    }, []);

    async function handleDelete(id: string) {
        await supabase.from("projects").delete().eq("id", id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
    }

    return (
        <DataTable
            title="Projekty"
            columns={columns}
            data={projects}
            createHref="/admin/projekty/new"
            editHref={(row) => `/admin/projekty/${row.id}`}
            onDelete={handleDelete}
        />
    );
}

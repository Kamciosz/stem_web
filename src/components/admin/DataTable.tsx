"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronUp,
    ChevronDown,
    Pencil,
    Trash2,
    Plus,
    Search,
} from "lucide-react";

export interface Column<T> {
    key: keyof T & string;
    label: string;
    sortable?: boolean;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
    columns: Column<T>[];
    data: T[];
    title: string;
    createHref?: string;
    editHref?: (row: T) => string;
    onDelete?: (id: string) => Promise<void>;
}

export default function DataTable<T extends { id: string }>({
    columns,
    data,
    title,
    createHref,
    editHref,
    onDelete,
}: DataTableProps<T>) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [deleting, setDeleting] = useState<string | null>(null);

    function handleSort(key: string) {
        if (sortKey === key) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    }

    const filtered = data.filter((row) =>
        columns.some((col) => {
            const val = row[col.key];
            return String(val ?? "")
                .toLowerCase()
                .includes(search.toLowerCase());
        })
    );

    const sorted = sortKey
        ? [...filtered].sort((a, b) => {
            const aVal = String(a[sortKey as keyof T] ?? "");
            const bVal = String(b[sortKey as keyof T] ?? "");
            const cmp = aVal.localeCompare(bVal, "pl");
            return sortDir === "asc" ? cmp : -cmp;
        })
        : filtered;

    async function handleDelete(id: string) {
        if (!onDelete) return;
        if (!confirm("Na pewno chcesz usunac ten element?")) return;
        setDeleting(id);
        await onDelete(id);
        setDeleting(null);
        router.refresh();
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold gradient-text">{title}</h1>
                {createHref && (
                    <a
                        href={createHref}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-purple-600)] hover:bg-[var(--color-purple-500)] text-white text-sm font-medium transition-all glow-purple"
                    >
                        <Plus size={16} />
                        Dodaj nowy
                    </a>
                )}
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-[var(--color-border)]">
                    <div className="relative">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                        />
                        <input
                            type="text"
                            placeholder="Szukaj..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-purple-500)] focus:outline-none transition-colors text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--color-border)]">
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider"
                                    >
                                        {col.sortable ? (
                                            <button
                                                onClick={() => handleSort(col.key)}
                                                className="flex items-center gap-1 hover:text-[var(--color-text-primary)] transition-colors"
                                            >
                                                {col.label}
                                                {sortKey === col.key ? (
                                                    sortDir === "asc" ? (
                                                        <ChevronUp size={14} />
                                                    ) : (
                                                        <ChevronDown size={14} />
                                                    )
                                                ) : null}
                                            </button>
                                        ) : (
                                            col.label
                                        )}
                                    </th>
                                ))}
                                {(editHref || onDelete) && (
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider w-24">
                                        Akcje
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length + (editHref || onDelete ? 1 : 0)}
                                        className="px-4 py-12 text-center text-[var(--color-text-muted)]"
                                    >
                                        Brak danych
                                    </td>
                                </tr>
                            ) : (
                                sorted.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-accent-subtle)] transition-colors"
                                    >
                                        {columns.map((col) => (
                                            <td
                                                key={col.key}
                                                className="px-4 py-3 text-sm text-[var(--color-text-secondary)]"
                                            >
                                                {col.render
                                                    ? col.render(row[col.key], row)
                                                    : String(row[col.key] ?? "")}
                                            </td>
                                        ))}
                                        {(editHref || onDelete) && (
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {editHref && (
                                                        <a
                                                            href={editHref(row)}
                                                            className="p-2 rounded-lg hover:bg-[var(--color-purple-600)]/15 text-[var(--color-text-muted)] hover:text-[var(--color-purple-400)] transition-all"
                                                            aria-label="Edytuj"
                                                        >
                                                            <Pencil size={15} />
                                                        </a>
                                                    )}
                                                    {onDelete && (
                                                        <button
                                                            onClick={() => handleDelete(row.id)}
                                                            disabled={deleting === row.id}
                                                            className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-400 disabled:opacity-50 transition-all"
                                                            aria-label="Usun"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

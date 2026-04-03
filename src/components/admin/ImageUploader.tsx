"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
    value: string | null;
    onChange: (url: string | null) => void;
    bucket: "avatars" | "project-media" | "logos";
    label?: string;
}

export default function ImageUploader({
    value,
    onChange,
    bucket,
    label = "Obraz",
}: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Dozwolone tylko pliki graficzne.");
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError("Maksymalny rozmiar pliku: 5MB.");
            return;
        }

        setError("");
        setUploading(true);

        try {
            const { createBrowserClient } = await import("@supabase/ssr");
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const ext = file.name.split(".").pop();
            const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file);

            if (uploadError) {
                setError(uploadError.message);
                return;
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from(bucket).getPublicUrl(fileName);

            onChange(publicUrl);
        } catch {
            setError("Nie udało się przesłać pliku.");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                {label}
            </label>

            {value ? (
                <div className="relative inline-block">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-xl border border-[var(--color-border)]"
                    />
                    <button
                        type="button"
                        onClick={() => onChange(null)}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-400 transition-colors"
                        aria-label="Usuń obraz"
                    >
                        <X size={14} />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className="w-32 h-32 rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-purple-500)] flex flex-col items-center justify-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-purple-400)] transition-all disabled:opacity-50"
                >
                    {uploading ? (
                        <div className="w-6 h-6 border-2 border-[var(--color-purple-400)] border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <Upload size={20} />
                            <span className="text-xs">Upload</span>
                        </>
                    )}
                </button>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
            />

            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
    );
}

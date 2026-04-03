"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft } from "lucide-react";
import {
    InputField,
    TextareaField,
    SelectField,
    ToggleField,
    FormActions,
} from "@/components/admin/FormFields";
import ImageUploader from "@/components/admin/ImageUploader";
import type { Category, ProjectStatus } from "@/types/database";

interface ProjectForm {
    title_pl: string;
    title_en: string;
    slug: string;
    short_desc_pl: string;
    short_desc_en: string;
    full_desc_pl: string;
    full_desc_en: string;
    category: Category;
    github_repo: string;
    website_url: string;
    status: ProjectStatus;
    display_order: number;
}

const CATEGORY_OPTIONS = [
    { value: "programowanie", label: "Programowanie" },
    { value: "robotyka", label: "Robotyka" },
    { value: "mechatronika", label: "Mechatronika" },
    { value: "inne", label: "Inne" },
];

const STATUS_OPTIONS = [
    { value: "draft", label: "Szkic" },
    { value: "published", label: "Opublikowany" },
];

export default function AdminProjectEditPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const isNew = id === "new";

    const [loading, setLoading] = useState(false);
    const [isFeatured, setIsFeatured] = useState(false);
    const [isGroupProject, setIsGroupProject] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProjectForm>();

    useEffect(() => {
        if (!isNew) {
            supabase
                .from("projects")
                .select("*")
                .eq("id", id)
                .single()
                .then(({ data }) => {
                    if (data) {
                        reset({
                            title_pl: data.title_pl,
                            title_en: data.title_en ?? "",
                            slug: data.slug,
                            short_desc_pl: data.short_desc_pl,
                            short_desc_en: data.short_desc_en ?? "",
                            full_desc_pl: data.full_desc_pl ?? "",
                            full_desc_en: data.full_desc_en ?? "",
                            category: data.category as Category,
                            github_repo: data.github_repo ?? "",
                            website_url: data.website_url ?? "",
                            status: data.status as ProjectStatus,
                            display_order: data.display_order ?? 0,
                        });
                        setIsFeatured(data.is_featured);
                        setIsGroupProject(data.is_group_project);
                    }
                });
        }
    }, [id, isNew]);

    async function onSubmit(formData: ProjectForm) {
        setLoading(true);

        const payload = {
            ...formData,
            title_en: formData.title_en || null,
            short_desc_en: formData.short_desc_en || null,
            full_desc_en: formData.full_desc_en || null,
            github_repo: formData.github_repo || null,
            website_url: formData.website_url || null,
            is_featured: isFeatured,
            is_group_project: isGroupProject,
            display_order: Number(formData.display_order) || 0,
        };

        if (isNew) {
            await supabase.from("projects").insert(payload);
        } else {
            await supabase.from("projects").update(payload).eq("id", id);
        }

        setLoading(false);
        router.push("/admin/projekty");
        router.refresh();
    }

    return (
        <div className="max-w-3xl">
            <a
                href="/admin/projekty"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-purple-400)] transition-colors mb-6"
            >
                <ArrowLeft size={16} />
                Powrót do listy
            </a>

            <h1 className="text-3xl font-bold gradient-text mb-8">
                {isNew ? "Nowy projekt" : "Edytuj projekt"}
            </h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="glass-card rounded-2xl p-8 space-y-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Tytuł (PL)"
                        name="title_pl"
                        register={register}
                        errors={errors}
                        required
                    />
                    <InputField
                        label="Tytuł (EN)"
                        name="title_en"
                        register={register}
                        errors={errors}
                    />
                </div>

                <InputField
                    label="Slug"
                    name="slug"
                    register={register}
                    errors={errors}
                    required
                    placeholder="moj-projekt"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextareaField
                        label="Krótki opis (PL)"
                        name="short_desc_pl"
                        register={register}
                        errors={errors}
                        rows={3}
                        required
                    />
                    <TextareaField
                        label="Krótki opis (EN)"
                        name="short_desc_en"
                        register={register}
                        errors={errors}
                        rows={3}
                    />
                </div>

                <TextareaField
                    label="Pełny opis (PL)"
                    name="full_desc_pl"
                    register={register}
                    errors={errors}
                    rows={6}
                />
                <TextareaField
                    label="Pełny opis (EN)"
                    name="full_desc_en"
                    register={register}
                    errors={errors}
                    rows={6}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SelectField
                        label="Kategoria"
                        name="category"
                        register={register}
                        errors={errors}
                        options={CATEGORY_OPTIONS}
                        required
                    />
                    <SelectField
                        label="Status"
                        name="status"
                        register={register}
                        errors={errors}
                        options={STATUS_OPTIONS}
                        required
                    />
                    <InputField
                        label="Kolejność"
                        name="display_order"
                        register={register}
                        errors={errors}
                        type="number"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="GitHub repo URL"
                        name="github_repo"
                        register={register}
                        errors={errors}
                        placeholder="https://github.com/..."
                    />
                    <InputField
                        label="Website URL"
                        name="website_url"
                        register={register}
                        errors={errors}
                        placeholder="https://..."
                    />
                </div>

                <div className="space-y-2">
                    <ToggleField
                        label="Wyróżniony"
                        checked={isFeatured}
                        onChange={setIsFeatured}
                        description="Wyświetlany na stronie głównej"
                    />
                    <ToggleField
                        label="Projekt grupowy"
                        checked={isGroupProject}
                        onChange={setIsGroupProject}
                        description="Przypisany do grupy stałej"
                    />
                </div>

                <FormActions
                    loading={loading}
                    onCancel={() => router.push("/admin/projekty")}
                />
            </form>
        </div>
    );
}

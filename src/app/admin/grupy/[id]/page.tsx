"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft } from "lucide-react";
import {
    InputField,
    TextareaField,
    ToggleField,
    FormActions,
} from "@/components/admin/FormFields";
import ImageUploader from "@/components/admin/ImageUploader";

interface GroupForm {
    name: string;
    slug: string;
    description_pl: string;
    description_en: string;
}

export default function AdminGroupEditPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const isNew = id === "new";

    const [loading, setLoading] = useState(false);
    const [isPermanent, setIsPermanent] = useState(true);
    const [isVisible, setIsVisible] = useState(true);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<GroupForm>();

    useEffect(() => {
        if (!isNew) {
            supabase
                .from("groups")
                .select("*")
                .eq("id", id)
                .single()
                .then(({ data }) => {
                    if (data) {
                        reset({
                            name: data.name,
                            slug: data.slug,
                            description_pl: data.description_pl ?? "",
                            description_en: data.description_en ?? "",
                        });
                        setIsPermanent(data.is_permanent);
                        setIsVisible(data.is_visible);
                        setLogoUrl(data.logo_url);
                    }
                });
        }
    }, [id, isNew]);

    async function onSubmit(formData: GroupForm) {
        setLoading(true);

        const payload = {
            ...formData,
            description_pl: formData.description_pl || null,
            description_en: formData.description_en || null,
            is_permanent: isPermanent,
            is_visible: isVisible,
            logo_url: logoUrl,
        };

        if (isNew) {
            await supabase.from("groups").insert(payload);
        } else {
            await supabase.from("groups").update(payload).eq("id", id);
        }

        setLoading(false);
        router.push("/admin/grupy");
        router.refresh();
    }

    return (
        <div className="max-w-3xl">
            <a
                href="/admin/grupy"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-purple-400)] transition-colors mb-6"
            >
                <ArrowLeft size={16} />
                Powrót do listy
            </a>

            <h1 className="text-3xl font-bold gradient-text mb-8">
                {isNew ? "Nowa grupa" : "Edytuj grupę"}
            </h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="glass-card rounded-2xl p-8 space-y-6"
            >
                <ImageUploader
                    value={logoUrl}
                    onChange={setLogoUrl}
                    bucket="logos"
                    label="Logo grupy"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Nazwa"
                        name="name"
                        register={register}
                        errors={errors}
                        required
                    />
                    <InputField
                        label="Slug"
                        name="slug"
                        register={register}
                        errors={errors}
                        required
                        placeholder="web-team"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextareaField
                        label="Opis (PL)"
                        name="description_pl"
                        register={register}
                        errors={errors}
                        rows={4}
                    />
                    <TextareaField
                        label="Opis (EN)"
                        name="description_en"
                        register={register}
                        errors={errors}
                        rows={4}
                    />
                </div>

                <div className="space-y-2">
                    <ToggleField
                        label="Grupa stała"
                        checked={isPermanent}
                        onChange={setIsPermanent}
                        description="Grupy stałe mają własną podstronę"
                    />
                    <ToggleField
                        label="Widoczna"
                        checked={isVisible}
                        onChange={setIsVisible}
                    />
                </div>

                <FormActions
                    loading={loading}
                    onCancel={() => router.push("/admin/grupy")}
                />
            </form>
        </div>
    );
}

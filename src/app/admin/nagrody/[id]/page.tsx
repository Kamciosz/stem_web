"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft } from "lucide-react";
import {
    InputField,
    TextareaField,
    FormActions,
} from "@/components/admin/FormFields";
import ImageUploader from "@/components/admin/ImageUploader";

interface AwardForm {
    title_pl: string;
    title_en: string;
    description_pl: string;
    description_en: string;
    date: string;
    display_order: number;
}

export default function AdminAwardEditPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const isNew = id === "new";

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AwardForm>();

    useEffect(() => {
        if (!isNew) {
            supabase
                .from("awards")
                .select("*")
                .eq("id", id)
                .single()
                .then(({ data }) => {
                    if (data) {
                        reset({
                            title_pl: data.title_pl,
                            title_en: data.title_en ?? "",
                            description_pl: data.description_pl ?? "",
                            description_en: data.description_en ?? "",
                            date: data.date ?? "",
                            display_order: data.display_order,
                        });
                        setImageUrl(data.image_url);
                    }
                });
        }
    }, [id, isNew]);

    async function onSubmit(formData: AwardForm) {
        setLoading(true);

        const payload = {
            ...formData,
            title_en: formData.title_en || null,
            description_pl: formData.description_pl || null,
            description_en: formData.description_en || null,
            date: formData.date || null,
            display_order: Number(formData.display_order) || 0,
            image_url: imageUrl,
        };

        if (isNew) {
            await supabase.from("awards").insert(payload);
        } else {
            await supabase.from("awards").update(payload).eq("id", id);
        }

        setLoading(false);
        router.push("/admin/nagrody");
        router.refresh();
    }

    return (
        <div className="max-w-3xl">
            <a
                href="/admin/nagrody"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-purple-400)] transition-colors mb-6"
            >
                <ArrowLeft size={16} />
                Powrót do listy
            </a>

            <h1 className="text-3xl font-bold gradient-text mb-8">
                {isNew ? "Nowa nagroda" : "Edytuj nagrodę"}
            </h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="glass-card rounded-2xl p-8 space-y-6"
            >
                <ImageUploader
                    value={imageUrl}
                    onChange={setImageUrl}
                    bucket="logos"
                    label="Zdjęcie"
                />

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextareaField
                        label="Opis (PL)"
                        name="description_pl"
                        register={register}
                        errors={errors}
                        rows={3}
                    />
                    <TextareaField
                        label="Opis (EN)"
                        name="description_en"
                        register={register}
                        errors={errors}
                        rows={3}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Data"
                        name="date"
                        register={register}
                        errors={errors}
                        type="date"
                    />
                    <InputField
                        label="Kolejność"
                        name="display_order"
                        register={register}
                        errors={errors}
                        type="number"
                    />
                </div>

                <FormActions
                    loading={loading}
                    onCancel={() => router.push("/admin/nagrody")}
                />
            </form>
        </div>
    );
}

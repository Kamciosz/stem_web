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
import type { PartnerType } from "@/types/database";

interface PartnerForm {
    name: string;
    website_url: string;
    description_pl: string;
    description_en: string;
    type: PartnerType;
    tier: string;
    display_order: number;
}

const TYPE_OPTIONS = [
    { value: "partner", label: "Partner" },
    { value: "sponsor", label: "Sponsor" },
];

export default function AdminPartnerEditPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const isNew = id === "new";

    const [loading, setLoading] = useState(false);
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
    } = useForm<PartnerForm>();

    useEffect(() => {
        if (!isNew) {
            supabase
                .from("partners")
                .select("*")
                .eq("id", id)
                .single()
                .then(({ data }) => {
                    if (data) {
                        reset({
                            name: data.name,
                            website_url: data.website_url ?? "",
                            description_pl: data.description_pl ?? "",
                            description_en: data.description_en ?? "",
                            type: data.type as PartnerType,
                            tier: data.tier ?? "",
                            display_order: data.display_order,
                        });
                        setIsVisible(data.is_visible);
                        setLogoUrl(data.logo_url);
                    }
                });
        }
    }, [id, isNew]);

    async function onSubmit(formData: PartnerForm) {
        setLoading(true);

        const payload = {
            ...formData,
            website_url: formData.website_url || null,
            description_pl: formData.description_pl || null,
            description_en: formData.description_en || null,
            tier: formData.tier || null,
            display_order: Number(formData.display_order) || 0,
            is_visible: isVisible,
            logo_url: logoUrl ?? "",
        };

        if (isNew) {
            await supabase.from("partners").insert(payload);
        } else {
            await supabase.from("partners").update(payload).eq("id", id);
        }

        setLoading(false);
        router.push("/admin/partnerzy");
        router.refresh();
    }

    return (
        <div className="max-w-3xl">
            <a
                href="/admin/partnerzy"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-purple-400)] transition-colors mb-6"
            >
                <ArrowLeft size={16} />
                Powrót do listy
            </a>

            <h1 className="text-3xl font-bold gradient-text mb-8">
                {isNew ? "Nowy partner/sponsor" : "Edytuj partnera/sponsora"}
            </h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="glass-card rounded-2xl p-8 space-y-6"
            >
                <ImageUploader
                    value={logoUrl}
                    onChange={setLogoUrl}
                    bucket="logos"
                    label="Logo"
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
                        label="Website URL"
                        name="website_url"
                        register={register}
                        errors={errors}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SelectField
                        label="Typ"
                        name="type"
                        register={register}
                        errors={errors}
                        options={TYPE_OPTIONS}
                        required
                    />
                    <InputField
                        label="Tier"
                        name="tier"
                        register={register}
                        errors={errors}
                        placeholder="Gold, Silver..."
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

                <ToggleField
                    label="Widoczny"
                    checked={isVisible}
                    onChange={setIsVisible}
                />

                <FormActions
                    loading={loading}
                    onCancel={() => router.push("/admin/partnerzy")}
                />
            </form>
        </div>
    );
}

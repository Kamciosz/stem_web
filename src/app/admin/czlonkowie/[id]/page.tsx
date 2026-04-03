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

interface MemberForm {
    name: string;
    slug: string;
    nickname: string;
    bio_pl: string;
    bio_en: string;
    github_url: string;
    linkedin_url: string;
    website_url: string;
    email: string;
    role: string;
    display_order: number;
}

export default function AdminMemberEditPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const isNew = id === "new";

    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<MemberForm>();

    useEffect(() => {
        if (!isNew) {
            supabase
                .from("members")
                .select("*")
                .eq("id", id)
                .single()
                .then(({ data }) => {
                    if (data) {
                        reset({
                            name: data.name,
                            slug: data.slug,
                            nickname: data.nickname ?? "",
                            bio_pl: data.bio_pl ?? "",
                            bio_en: data.bio_en ?? "",
                            github_url: data.github_url ?? "",
                            linkedin_url: data.linkedin_url ?? "",
                            website_url: data.website_url ?? "",
                            email: data.email ?? "",
                            role: data.role,
                            display_order: data.display_order,
                        });
                        setIsVisible(data.is_visible);
                        setAvatarUrl(data.avatar_url);
                    }
                });
        }
    }, [id, isNew]);

    async function onSubmit(formData: MemberForm) {
        setLoading(true);

        const payload = {
            ...formData,
            nickname: formData.nickname || null,
            bio_pl: formData.bio_pl || null,
            bio_en: formData.bio_en || null,
            github_url: formData.github_url || null,
            linkedin_url: formData.linkedin_url || null,
            website_url: formData.website_url || null,
            email: formData.email || null,
            display_order: Number(formData.display_order) || 0,
            is_visible: isVisible,
            avatar_url: avatarUrl,
        };

        if (isNew) {
            await supabase.from("members").insert(payload);
        } else {
            await supabase.from("members").update(payload).eq("id", id);
        }

        setLoading(false);
        router.push("/admin/czlonkowie");
        router.refresh();
    }

    return (
        <div className="max-w-3xl">
            <a
                href="/admin/czlonkowie"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-purple-400)] transition-colors mb-6"
            >
                <ArrowLeft size={16} />
                Powrót do listy
            </a>

            <h1 className="text-3xl font-bold gradient-text mb-8">
                {isNew ? "Nowy członek" : "Edytuj członka"}
            </h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="glass-card rounded-2xl p-8 space-y-6"
            >
                <ImageUploader
                    value={avatarUrl}
                    onChange={setAvatarUrl}
                    bucket="avatars"
                    label="Avatar"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Imię i nazwisko"
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
                        placeholder="imie-nazwisko"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Pseudonim"
                        name="nickname"
                        register={register}
                        errors={errors}
                    />
                    <InputField
                        label="Rola"
                        name="role"
                        register={register}
                        errors={errors}
                        placeholder="member"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextareaField
                        label="Bio (PL)"
                        name="bio_pl"
                        register={register}
                        errors={errors}
                        rows={4}
                    />
                    <TextareaField
                        label="Bio (EN)"
                        name="bio_en"
                        register={register}
                        errors={errors}
                        rows={4}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="GitHub URL"
                        name="github_url"
                        register={register}
                        errors={errors}
                    />
                    <InputField
                        label="LinkedIn URL"
                        name="linkedin_url"
                        register={register}
                        errors={errors}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Website URL"
                        name="website_url"
                        register={register}
                        errors={errors}
                    />
                    <InputField
                        label="Email"
                        name="email"
                        register={register}
                        errors={errors}
                        type="email"
                    />
                </div>

                <InputField
                    label="Kolejność wyświetlania"
                    name="display_order"
                    register={register}
                    errors={errors}
                    type="number"
                />

                <ToggleField
                    label="Widoczny"
                    checked={isVisible}
                    onChange={setIsVisible}
                    description="Czy profil jest widoczny publicznie"
                />

                <FormActions
                    loading={loading}
                    onCancel={() => router.push("/admin/czlonkowie")}
                />
            </form>
        </div>
    );
}

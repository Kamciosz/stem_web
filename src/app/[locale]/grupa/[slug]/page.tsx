import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import GroupView from "@/components/group/GroupView";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const name = slug.replace(/-/g, " ");
    return {
        title: name,
        description: `Grupa ${name} — STEM x TEB Technikum`,
    };
}

export default async function GroupPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    return <GroupView slug={slug} />;
}

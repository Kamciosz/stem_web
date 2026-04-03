import type { MetadataRoute } from "next";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://stem.teb.pl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll() { },
            },
        }
    );

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
        { url: `${BASE_URL}/projekty`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
        { url: `${BASE_URL}/partnerzy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
        { url: `${BASE_URL}/sponsorzy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
        { url: `${BASE_URL}/kontakt`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        { url: `${BASE_URL}/en`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${BASE_URL}/en/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    ];

    const dynamicRoutes: MetadataRoute.Sitemap = [];

    try {
        const [{ data: projects }, { data: members }, { data: groups }] =
            await Promise.all([
                supabase
                    .from("projects")
                    .select("slug, updated_at")
                    .eq("status", "published"),
                supabase
                    .from("members")
                    .select("slug, updated_at")
                    .eq("is_visible", true),
                supabase
                    .from("groups")
                    .select("slug, updated_at")
                    .eq("is_visible", true),
            ]);

        projects?.forEach((p) => {
            dynamicRoutes.push({
                url: `${BASE_URL}/projekt/${p.slug}`,
                lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
                changeFrequency: "weekly",
                priority: 0.8,
            });
        });

        members?.forEach((m) => {
            dynamicRoutes.push({
                url: `${BASE_URL}/profil/${m.slug}`,
                lastModified: m.updated_at ? new Date(m.updated_at) : new Date(),
                changeFrequency: "monthly",
                priority: 0.5,
            });
        });

        groups?.forEach((g) => {
            dynamicRoutes.push({
                url: `${BASE_URL}/grupa/${g.slug}`,
                lastModified: g.updated_at ? new Date(g.updated_at) : new Date(),
                changeFrequency: "monthly",
                priority: 0.5,
            });
        });
    } catch {
        // Supabase not configured yet — return static routes only
    }

    return [...staticRoutes, ...dynamicRoutes];
}

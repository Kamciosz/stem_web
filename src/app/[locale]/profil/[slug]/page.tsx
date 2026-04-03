import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import ProfileView from "@/components/profile/ProfileView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ");
  return {
    title: name,
    description: `Profil ${name} — STEM x TEB Technikum`,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return <ProfileView slug={slug} />;
}

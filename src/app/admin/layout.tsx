import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/Sidebar";

export const metadata = {
    title: "Admin — STEM × TEB Technikum",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createServerSupabaseClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/admin/login");
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <AdminSidebar />
            <main className="ml-64 min-h-screen">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}

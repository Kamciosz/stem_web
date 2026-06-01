import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { isAdminAuthenticated } from "@/lib/auth";

export const metadata = {
  title: "Admin Panel | Kolko Technologiczne",
};

export default async function AdminPanelPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/adminpanel/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="content-wrap py-10 md:py-14">
        <h1 className="text-3xl font-bold">Panel opiekuna</h1>
        <p className="mt-3 text-[var(--muted)]">
          Dostep jest zabezpieczony sesja HTTP-only. Kolejny etap implementacji doda CRUD i upload mediow.
        </p>
        <div className="mt-8 rounded-2xl border border-[#d7e4df] bg-white p-5">
          <h2 className="text-xl font-bold">Status wdrozenia</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-[var(--muted)]">
            <li>Warstwa publiczna MVP: gotowa</li>
            <li>Routing projektow i profili: gotowy</li>
            <li>Autoryzacja panelu: aktywna</li>
            <li>Nastepny krok: formularze CRUD + integracja Supabase</li>
          </ul>
        </div>
        <form action="/api/admin/logout" method="post" className="mt-6">
          <button className="rounded-full border border-[#b9ccc5] px-5 py-2 font-semibold">Wyloguj</button>
        </form>
        <p className="mt-6 text-sm text-[var(--muted)]">
          Wroc do <Link href="/" className="font-semibold text-[var(--accent)]">strony glownej</Link>.
        </p>
      </main>
    </div>
  );
}

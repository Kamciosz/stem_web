import { LoginForm } from "@/components/login-form";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Logowanie admina | Kolko Technologiczne",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="content-wrap grid py-10 md:py-14">
        <section className="mx-auto w-full max-w-md">
          <h1 className="text-3xl font-bold">Logowanie opiekuna</h1>
          <p className="mt-3 text-[var(--muted)]">
            Token przechowywany jest po stronie serwera i porownywany przed otwarciem panelu.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </section>
      </main>
    </div>
  );
}

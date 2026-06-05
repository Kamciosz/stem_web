import { Contact } from "@/components/sections/Contact";

export const dynamic = "force-static";

export const metadata = {
    title: "Kontakt | STEM",
    description: "Skontaktuj się z kołem technologicznym STEM. Warszawa, ul. Mińska 25. Email, Discord, Teams — dołącz do nas lub zostań partnerem.",
    alternates: { canonical: "/kontakt" },
    openGraph: { url: "/kontakt" }
};

export default function ContactPage() {
    return <Contact fullPage />;
}

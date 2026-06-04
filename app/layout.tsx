import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { Logo } from "@/components/navigation/Logo";
import { Footer } from "@/components/sections/Footer";
import { ParallaxLayers } from "@/components/ui/ParallaxLayers";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin-ext"],
    weight: "variable",
    variable: "--font-space-grotesk"
});

const inter = Inter({
    subsets: ["latin-ext"],
    weight: ["400", "700"],
    variable: "--font-inter"
});

const jetBrainsMono = JetBrains_Mono({
    subsets: ["latin-ext"],
    weight: ["400", "500", "700"],
    variable: "--font-jetbrains-mono"
});

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ["latin-ext"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-plus-jakarta"
});

export const metadata: Metadata = {
    title: "STEM | Koło Technologiczne",
    description: "Koło Technologiczne STEM: robotyka, mechatronika, programowanie.",
    metadataBase: new URL("https://stem-web-569q.vercel.app"),
    alternates: { canonical: "/" },
    openGraph: {
        type: "website",
        locale: "pl_PL",
        siteName: "STEM | Koło Technologiczne",
        title: "STEM | Koło Technologiczne",
        description: "Koło Technologiczne STEM: robotyka, mechatronika, programowanie."
    }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "STEM | Koło Technologiczne",
            alternateName: "Koło Technologiczne STEM",
            description: "Koło Technologiczne STEM: robotyka, mechatronika, programowanie. Uczniowie technikum tworzący w hardware i software.",
            url: "https://stem-web-569q.vercel.app",
            email: "kontakt@stem-kolo.pl",
            address: {
                "@type": "PostalAddress",
                streetAddress: "ul. Mińska 25",
                addressLocality: "Warszawa",
                addressCountry: "PL"
            },
            knowsAbout: ["Robotyka", "Mechatronika", "Programowanie", "Elektronika"]
        },
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "STEM | Koło Technologiczne",
            url: "https://stem-web-569q.vercel.app",
            inLanguage: "pl-PL"
        }
    ];

    return (
        <html lang="pl">
            <body className={`${spaceGrotesk.variable} ${inter.variable} ${jetBrainsMono.variable} ${plusJakarta.variable}`}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <ScrollProgress />
                <ParallaxLayers />
                <Logo />
                <main className="page-transition">{children}</main>
                <Footer />
            </body>
        </html>
    );
}

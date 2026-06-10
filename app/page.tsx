import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { PartnersMarquee } from "@/components/sections/PartnersMarquee";
import { Projects } from "@/components/sections/Projects";
import { TeamPreview } from "@/components/sections/TeamPreview";
import { CoursesFooterLink } from "@/components/sections/CoursesFooterLink";

export const dynamic = "force-static";

export default async function HomePage() {
    return (
        <>
            <Hero />
            <About />
            <PartnersMarquee />
            <Projects />
            <TeamPreview />
            <Contact />
            <CoursesFooterLink />
        </>
    );
}
// touched at sob.  6 cze 2026 20:31:11 CEST

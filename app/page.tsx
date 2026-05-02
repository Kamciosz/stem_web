import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { PartnersMarquee } from "@/components/sections/PartnersMarquee";
import { Projects } from "@/components/sections/Projects";
import { TeamPreview } from "@/components/sections/TeamPreview";

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
        </>
    );
}

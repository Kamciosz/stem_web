import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { PartnersMarquee } from "@/components/sections/PartnersMarquee";
import { Projects } from "@/components/sections/Projects";
import { TeamPreview } from "@/components/sections/TeamPreview";
import { FeaturedExams } from "@/components/sections/FeaturedExams";

export const dynamic = "force-static";

export default async function HomePage() {
    return (
        <>
            <Hero />
            <FeaturedExams />
            <About />
            <PartnersMarquee />
            <Projects />
            <TeamPreview />
            <Contact />
        </>
    );
}

import { setRequestLocale } from "next-intl/server";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ProjectsShowcase from "@/components/home/ProjectsShowcase";
import PartnersCarousel from "@/components/home/PartnersCarousel";
import AwardsSection from "@/components/home/AwardsSection";
import ContactSection from "@/components/home/ContactSection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <PartnersCarousel />
      <AwardsSection />
      <ProjectsShowcase />
      <ContactSection />
    </>
  );
}

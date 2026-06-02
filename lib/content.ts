export type ProfileType = "user" | "group";

export type Profile = {
  slug: string;
  name: string;
  type: ProfileType;
  bio: string;
  image: string;
};

export type Project = {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  coverImage: string;
  tags: string[];
  authorSlugs: string[];
};

export const profiles: Profile[] = [
  {
    slug: "team-rewear",
    name: "Zespol ReWear",
    type: "group",
    bio: "Projektanci i programisci tworzacy obieg ubrań z wsparciem technologii.",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "olivia-kowalska",
    name: "Oliwia Kowalska",
    type: "user",
    bio: "Liderka zespolu IoT i mentorka warsztatow dla mlodszych klas.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "tebtalk-team",
    name: "TEbTalk Team",
    type: "group",
    bio: "Zespol wydarzen i transmisji odpowiedzialny za prelekcje oraz podsumowania.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  },
];

export const projects: Project[] = [
  {
    slug: "rewear",
    title: "ReWear",
    shortDescription:
      "Cyfrowa platforma drugiego obiegu ubran z naciskiem na edukacje ekologiczna.",
    longDescription:
      "Projekt laczy aplikacje webowa, panel nauczyciela i raportowanie efektu ekologicznego. Uczniowie testuja prototyp w realnych warunkach szkolnych.",
    coverImage:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80",
    tags: ["ekologia", "web", "ui"],
    authorSlugs: ["team-rewear", "olivia-kowalska"],
  },
  {
    slug: "tebtalk",
    title: "TEbTalk",
    shortDescription:
      "Cykl prelekcji STEM z materialami po wydarzeniach i panelem prezentera.",
    longDescription:
      "TEbTalk porzadkuje harmonogram wydarzen i udostepnia gotowe prezentacje z notatkami. Dzieki temu partnerzy i uczniowie maja jeden, spójny kanal wiedzy.",
    coverImage:
      "https://images.unsplash.com/photo-1540317580384-e5d43867caa6?auto=format&fit=crop&w=1600&q=80",
    tags: ["wydarzenia", "prezentacje", "video"],
    authorSlugs: ["tebtalk-team"],
  },
  {
    slug: "feed",
    title: "Feed",
    shortDescription:
      "Agregator postepow projektow i aktualnosci dzialajacy w czasie zblizonym do rzeczywistego.",
    longDescription:
      "Feed wspiera transparentnosc prac, laczy wpisy zespolow i automatycznie tworzy podsumowania do pokazow partnerskich.",
    coverImage:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1600&q=80",
    tags: ["api", "dashboard", "analityka"],
    authorSlugs: ["olivia-kowalska"],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProfileBySlug(slug: string): Profile | undefined {
  return profiles.find((profile) => profile.slug === slug);
}

export function getProfilesForProject(project: Project): Profile[] {
  return profiles.filter((profile) => project.authorSlugs.includes(profile.slug));
}

export function getProjectsForProfile(profileSlug: string): Project[] {
  return projects.filter((project) => project.authorSlugs.includes(profileSlug));
}

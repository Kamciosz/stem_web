import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pl", "en"],
  defaultLocale: "pl",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/projekty": {
      pl: "/projekty",
      en: "/projects",
    },
    "/projekt/[slug]": {
      pl: "/projekt/[slug]",
      en: "/project/[slug]",
    },
    "/profil/[slug]": {
      pl: "/profil/[slug]",
      en: "/profile/[slug]",
    },
    "/grupa/[slug]": {
      pl: "/grupa/[slug]",
      en: "/group/[slug]",
    },
    "/partnerzy": {
      pl: "/partnerzy",
      en: "/partners",
    },
    "/kontakt": {
      pl: "/kontakt",
      en: "/contact",
    },
  },
});

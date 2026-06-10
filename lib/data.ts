export type GithubFallback = {
    stars: number;
    language: string;
    lastCommit: string;
};

export type TeamMember = {
    slug: string;
    name: string;
    role: string;
    github?: string;
    linkedin?: string;
    image: string;
    description: string;
    demo?: boolean;
};

export type Project = {
    slug: string;
    title: string;
    category: "PROGRAMOWANIE" | "ROBOTYKA" | "MECHATRONIKA";
    description: string;
    author: string;
    authorNickname?: string;
    authorSlug: string;
    githubUrl?: string;
    image: string;
    featured: boolean;
    fallbackGithub: GithubFallback;
    demo?: boolean;
};

export type Partner = {
    name: string;
    description: string;
    website: string;
    logo: string;
};

export type Course = {
    id: string;
    title: string;
    subtitle: string;
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    tech: string[];
    description: string;
};

export const courses: Course[] = [
    {
        id: "python-podstawy",
        title: "Python od Podstaw",
        subtitle: "Pierwsza linia kodu",
        level: "BEGINNER",
        tech: ["Python"],
        description: "Zmienne, funkcje, pętle, listy, słowniki. Pełny wstęp do programowania bez zakładania żadnej wiedzy wstępnej."
    },
    {
        id: "javascript-web",
        title: "JavaScript & Web Dev",
        subtitle: "Strony i aplikacje interaktywne",
        level: "BEGINNER",
        tech: ["JavaScript", "HTML", "CSS"],
        description: "DOM, zdarzenia, fetch API, podstawy React. Od statycznej strony do działającej aplikacji webowej."
    },
    {
        id: "cpp-robotyka",
        title: "C++ dla Robotyki",
        subtitle: "Niskopoziomowa kontrola sprzętu",
        level: "INTERMEDIATE",
        tech: ["C++", "Arduino", "ESP32"],
        description: "Wskaźniki, klasy, zarządzanie pamięcią. Programowanie mikrokontrolerów i interfejsów sprzętowych."
    },
    {
        id: "typescript-advanced",
        title: "TypeScript w Praktyce",
        subtitle: "Typowany JavaScript na poważnie",
        level: "INTERMEDIATE",
        tech: ["TypeScript", "React", "Node.js"],
        description: "Typy, interfejsy, generyki, dekoratory. Budowanie skalowalnych aplikacji z pełnym bezpieczeństwem typów."
    },
    {
        id: "mikrokontrolery",
        title: "Programowanie Mikrokontrolerów",
        subtitle: "Hardware pod pełną kontrolą",
        level: "INTERMEDIATE",
        tech: ["C", "Arduino", "Raspberry Pi"],
        description: "GPIO, protokoły I2C/SPI/UART, przerwania, timery. Sterowanie serwomechanizmami, czujnikami i wyświetlaczami."
    },
    {
        id: "algorytmy",
        title: "Algorytmy i Struktury Danych",
        subtitle: "Myślenie jak komputer",
        level: "INTERMEDIATE",
        tech: ["Python", "C++"],
        description: "Złożoność obliczeniowa, sortowanie, drzewa, grafy, programowanie dynamiczne. Fundament każdej kariery inżynierskiej."
    },
    {
        id: "git-devops",
        title: "Git & DevOps",
        subtitle: "Praca zespołowa i wdrożenia",
        level: "BEGINNER",
        tech: ["Git", "GitHub", "Docker"],
        description: "Branching, merge, pull requesty, CI/CD, kontenery Docker. Narzędzia codziennej pracy każdego developera."
    },
    {
        id: "aplikacje-mobilne",
        title: "Aplikacje Mobilne",
        subtitle: "Android i iOS jednym kodem",
        level: "ADVANCED",
        tech: ["React Native", "TypeScript"],
        description: "Komponenty natywne, nawigacja, integracja z kamerą i GPS. Publikacja na App Store i Google Play."
    },
    {
        id: "rust-systemy",
        title: "Rust — Systemy bez Crashy",
        subtitle: "Bezpieczna niskopoziomowa moc",
        level: "ADVANCED",
        tech: ["Rust"],
        description: "Ownership, borrowing, lifetimes, traits. Pisanie oprogramowania systemowego które jest bezpieczne i szybkie."
    }
];

export const pillars = [
    {
        label: "01 ROBOTYKA",
        text: "Projektowanie i budowa autonomicznych systemów"
    },
    {
        label: "02 MECHATRONIKA",
        text: "Integracja mechaniki, elektroniki i kodu"
    },
    {
        label: "03 PROGRAMOWANIE",
        text: "Aplikacje, strony, narzędzia"
    }
] as const;

export const team: TeamMember[] = [
    {
        slug: "szymon-sosnowski",
        name: "Szymon Sosnowski",
        role: "Programowanie",
        github: "Kamciosz",
        image: "/images/team-szymon-sosnowski.svg",
        description: "Projektuje aplikacje i narzędzia webowe. Pracuje na styku użyteczności, frontendu i systemowej dyscypliny."
    },
    {
        slug: "jan-kowalski",
        name: "Jan Kowalski",
        role: "Robotyka",
        image: "/images/team-jan-kowalski.svg",
        description: "Buduje prototypy mobilnych robotów, kalibruje czujniki i zamienia testy torowe w konkretne poprawki.",
        demo: true
    },
    {
        slug: "anna-nowak",
        name: "Anna Nowak",
        role: "Mechatronika",
        image: "/images/team-anna-nowak.svg",
        description: "Łączy mechanikę, elektronikę i sterowanie. Pilnuje, żeby każdy układ był mierzalny i powtarzalny.",
        demo: true
    },
    {
        slug: "piotr-wisniewski",
        name: "Piotr Wiśniewski",
        role: "Programowanie",
        image: "/images/team-piotr-wisniewski.svg",
        description: "Tworzy interfejsy, automatyzacje i szybkie narzędzia wspierające pracę zespołu projektowego.",
        demo: true
    },
    {
        slug: "katarzyna-lewandowska",
        name: "Katarzyna Lewandowska",
        role: "Mechatronika",
        image: "/images/team-katarzyna-lewandowska.svg",
        description: "Odpowiada za testy modułów, dokumentację prototypów i porządek w schematach układów.",
        demo: true
    },
    {
        slug: "michal-zielinski",
        name: "Michał Zieliński",
        role: "Robotyka",
        image: "/images/team-michal-zielinski.svg",
        description: "Pracuje nad napędami, czujnikami i algorytmami sterowania ruchem dla małych platform autonomicznych.",
        demo: true
    },
    {
        slug: "aleksandra-dabrowska",
        name: "Aleksandra Dąbrowska",
        role: "Programowanie",
        image: "/images/team-aleksandra-dabrowska.svg",
        description: "Buduje prototypy aplikacji, strukturyzuje dane projektowe i dopina szczegóły interakcji.",
        demo: true
    },
    {
        slug: "tomasz-szymanski",
        name: "Tomasz Szymański",
        role: "Mechatronika",
        image: "/images/team-tomasz-szymanski.svg",
        description: "Składa stanowiska testowe, pracuje z aktuatorami i doprowadza mechanikę do stanu gotowego na kod.",
        demo: true
    }
];

export const projects: Project[] = [
    {
        slug: "teb-app",
        title: "TEB App",
        category: "PROGRAMOWANIE",
        description: "PWA stworzona dla społeczności uczniowskiej. Zarządzanie zadaniami, harmonogram i komunikacja w jednej aplikacji.",
        author: "Szymon Sosnowski",
        authorNickname: "Szymek",
        authorSlug: "szymon-sosnowski",
        githubUrl: "https://github.com/Kamciosz/teb-app-production",
        image: "/images/project-teb-app.svg",
        featured: true,
        fallbackGithub: {
            stars: 0,
            language: "TypeScript",
            lastCommit: "2026-01-15"
        }
    },
    {
        slug: "projekt-robotyka",
        title: "Projekt Robotyka",
        category: "ROBOTYKA",
        description: "Autonomiczny robot mobilny z modułem rozpoznawania obiektów. Sterowanie PID, sensory ultradźwiękowe.",
        author: "Jan Kowalski",
        authorSlug: "jan-kowalski",
        image: "/images/project-robotyka.svg",
        featured: true,
        fallbackGithub: {
            stars: 0,
            language: "C++",
            lastCommit: "2026-01-08"
        },
        demo: true
    },
    {
        slug: "projekt-mechatronika",
        title: "Projekt Mechatronika",
        category: "MECHATRONIKA",
        description: "System automatyzacji linii produkcyjnej w skali mikro. PLC, sterowniki, integracja czujników.",
        author: "Anna Nowak",
        authorSlug: "anna-nowak",
        image: "/images/project-mechatronika.svg",
        featured: true,
        fallbackGithub: {
            stars: 0,
            language: "Structured Text",
            lastCommit: "2026-01-03"
        },
        demo: true
    }
];

export const partners: Partner[] = [];

export const terminalLogs = [
    "SYSTEM ONLINE",
    "3 PROJECTS LOADED",
    "8 MEMBERS ACTIVE",
    "BUILD STATIC",
    "NO BACKEND ATTACHED"
] as const;

export function getProjectBySlug(slug: string) {
    return projects.find((project) => project.slug === slug);
}

export function getTeamMemberBySlug(slug: string) {
    return team.find((member) => member.slug === slug);
}

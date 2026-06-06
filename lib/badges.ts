/**
 * Reguly gamification - badges za progres.
 */

export type Badge = {
    id: string;
    title: string;
    description: string;
    icon: string;
    threshold: (stats: { done: number; inProgress: number; sessions: number }) => boolean;
};

export const BADGES: Badge[] = [
    {
        id: "first-step",
        title: "Pierwszy krok",
        description: "Ukonczenie pierwszego egzaminu",
        icon: "🌱",
        threshold: (s) => s.done >= 1,
    },
    {
        id: "session-2025",
        title: "Biegles w sesji 2025",
        description: "Ukonczenie wszystkich egzaminow z sesji Styczen lub Czerwiec 2025",
        icon: "🎯",
        threshold: () => false, // computed dynamically
    },
    {
        id: "ten-done",
        title: "Wytrwalnosc",
        description: "10 ukonczonych egzaminow",
        icon: "🔥",
        threshold: (s) => s.done >= 10,
    },
    {
        id: "all-done",
        title: "Mistrz INF.03",
        description: "Wszystkie 54 egzaminy ukonczone",
        icon: "👑",
        threshold: (s) => s.done >= 54,
    },
    {
        id: "polyglot",
        title: "Poliglota technologii",
        description: "5+ roznych technologii w ukonczonych egzaminach",
        icon: "🧬",
        threshold: () => false,
    },
];

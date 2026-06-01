import type { MDXComponents } from "mdx/types";
import { Term } from "@/components/courses/Term";
import { VideoEmbed } from "@/components/courses/VideoEmbed";
import { Callout } from "@/components/courses/Callout";

// Uwaga: stary komponent <Quiz> (pytania w kodzie) został usunięty z rejestru.
// Quizy żyją na osobnej podstronie /quiz i lecą z Supabase (QuizClient).
export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        // Komponenty dostępne w każdej lekcji .mdx bez importu
        Term,
        VideoEmbed,
        Callout,
        ...components
    };
}

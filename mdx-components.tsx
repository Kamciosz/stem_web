import type { MDXComponents } from "mdx/types";
import { Term } from "@/components/courses/Term";
import { VideoEmbed } from "@/components/courses/VideoEmbed";
import { Quiz } from "@/components/courses/Quiz";
import { Callout } from "@/components/courses/Callout";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        // Komponenty dostępne w każdej lekcji .mdx bez importu
        Term,
        VideoEmbed,
        Quiz,
        Callout,
        ...components
    };
}

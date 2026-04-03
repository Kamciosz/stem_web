"use client";

import { Star, GitCommit, Code2 } from "lucide-react";
import type { GitHubRepoStats } from "@/lib/github";

interface GitHubStatsProps {
    stats: GitHubRepoStats | null;
    compact?: boolean;
}

export default function GitHubStats({
    stats,
    compact = false,
}: GitHubStatsProps) {
    if (!stats) return null;

    const totalBytes = Object.values(stats.languages).reduce(
        (a, b) => a + b,
        0
    );
    const topLanguages = Object.entries(stats.languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

    if (compact) {
        return (
            <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1">
                    <Star size={14} className="text-[var(--color-purple-400)]" />
                    {stats.stars}
                </span>
                {stats.lastCommitDate && (
                    <span className="flex items-center gap-1">
                        <GitCommit size={14} className="text-[var(--color-purple-400)]" />
                        {new Date(stats.lastCommitDate).toLocaleDateString("pl-PL")}
                    </span>
                )}
                {topLanguages.length > 0 && (
                    <span className="flex items-center gap-1">
                        <Code2 size={14} className="text-[var(--color-purple-400)]" />
                        {topLanguages[0][0]}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className="glass-card rounded-xl p-5">
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <Code2 size={16} className="text-[var(--color-purple-400)]" />
                GitHub Stats
            </h4>

            <div className="flex items-center gap-6 text-sm text-[var(--color-text-secondary)] mb-4">
                <span className="flex items-center gap-1.5">
                    <Star size={16} className="text-yellow-400" />
                    {stats.stars} stars
                </span>
                {stats.lastCommitDate && (
                    <span className="flex items-center gap-1.5">
                        <GitCommit
                            size={16}
                            className="text-[var(--color-purple-400)]"
                        />
                        {new Date(stats.lastCommitDate).toLocaleDateString("pl-PL")}
                    </span>
                )}
            </div>

            {topLanguages.length > 0 && totalBytes > 0 && (
                <div>
                    <div className="flex rounded-full h-2 overflow-hidden mb-2">
                        {topLanguages.map(([lang, bytes]) => (
                            <div
                                key={lang}
                                className="h-full first:rounded-l-full last:rounded-r-full"
                                style={{
                                    width: `${(bytes / totalBytes) * 100}%`,
                                    backgroundColor: getLanguageColor(lang),
                                }}
                            />
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-[var(--color-text-muted)]">
                        {topLanguages.map(([lang, bytes]) => (
                            <span key={lang} className="flex items-center gap-1.5">
                                <span
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: getLanguageColor(lang) }}
                                />
                                {lang} {((bytes / totalBytes) * 100).toFixed(1)}%
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function getLanguageColor(language: string): string {
    const colors: Record<string, string> = {
        TypeScript: "#3178c6",
        JavaScript: "#f1e05a",
        Python: "#3572A5",
        Rust: "#dea584",
        Go: "#00ADD8",
        Java: "#b07219",
        "C++": "#f34b7d",
        C: "#555555",
        HTML: "#e34c26",
        CSS: "#563d7c",
        SCSS: "#c6538c",
        Swift: "#F05138",
        Kotlin: "#A97BFF",
        Ruby: "#701516",
        PHP: "#4F5D95",
        Shell: "#89e051",
        Dart: "#00B4AB",
    };
    return colors[language] || "#8b45ff";
}

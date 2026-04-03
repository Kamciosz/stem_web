"use client";

import { useEffect, useState } from "react";
import { Star, GitCommit } from "lucide-react";

interface RepoStats {
  stars: number;
  lastCommitDate: string | null;
  lastCommitMessage: string | null;
  languages: Record<string, number>;
}

export function GitHubStats({ repoUrl }: { repoUrl: string }) {
  const [stats, setStats] = useState<RepoStats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return;

        const [, owner, repoRaw] = match;
        const repo = repoRaw.replace(/\.git$/, "");

        const [repoRes, commitsRes, langsRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${owner}/${repo}`),
          fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`),
          fetch(`https://api.github.com/repos/${owner}/${repo}/languages`),
        ]);

        if (!repoRes.ok) return;

        const repoData = await repoRes.json();
        const commits = await commitsRes.json();
        const langs = await langsRes.json();

        setStats({
          stars: repoData.stargazers_count ?? 0,
          lastCommitDate: commits[0]?.commit?.committer?.date ?? null,
          lastCommitMessage: commits[0]?.commit?.message ?? null,
          languages: langs,
        });
      } catch {
        // GitHub API rate limit or network error — silent fail
      }
    }

    fetchStats();
  }, [repoUrl]);

  if (!stats) return null;

  const totalBytes = Object.values(stats.languages).reduce(
    (sum, bytes) => sum + bytes,
    0
  );

  return (
    <div className="space-y-3">
      {/* Stars + last commit */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1.5">
          <Star size={14} className="text-yellow-500" />
          {stats.stars} stars
        </span>
        {stats.lastCommitDate && (
          <span className="flex items-center gap-1.5">
            <GitCommit size={14} />
            {new Date(stats.lastCommitDate).toLocaleDateString("pl-PL")}
          </span>
        )}
      </div>

      {/* Language breakdown bar */}
      {totalBytes > 0 && (
        <div>
          <div className="flex h-2 rounded-full overflow-hidden bg-[var(--color-bg-card)]">
            {Object.entries(stats.languages).map(([lang, bytes]) => {
              const pct = (bytes / totalBytes) * 100;
              if (pct < 1) return null;
              return (
                <div
                  key={lang}
                  className="h-full"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: LANG_COLORS[lang] ?? "#8b45ff",
                  }}
                  title={`${lang}: ${pct.toFixed(1)}%`}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {Object.entries(stats.languages).map(([lang, bytes]) => {
              const pct = (bytes / totalBytes) * 100;
              if (pct < 1) return null;
              return (
                <span key={lang} className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: LANG_COLORS[lang] ?? "#8b45ff" }}
                  />
                  {lang} {pct.toFixed(1)}%
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Common language colors (from GitHub linguist)
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Astro: "#bc52ee",
};

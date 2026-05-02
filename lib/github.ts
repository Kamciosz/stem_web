import type { Project } from "./data";

export type GithubStats = {
    stars: number;
    language: string;
    lastCommit: string;
};

type GithubRepoResponse = {
    stargazers_count?: number;
    language?: string | null;
};

type GithubCommitResponse = Array<{
    commit?: {
        author?: {
            date?: string;
        };
    };
}>;

function parseGithubRepo(url?: string) {
    if (!url) {
        return null;
    }

    try {
        const parsed = new URL(url);
        const [owner, repo] = parsed.pathname.replace(/^\//, "").split("/");
        if (!owner || !repo) {
            return null;
        }
        return { owner, repo };
    } catch {
        return null;
    }
}

function formatDate(date?: string) {
    if (!date) {
        return undefined;
    }

    return new Intl.DateTimeFormat("pl-PL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date(date));
}

export async function getGithubStats(project: Project): Promise<GithubStats> {
    const repo = parseGithubRepo(project.githubUrl);
    const fallback = project.fallbackGithub;

    if (!repo) {
        return fallback;
    }

    const headers: HeadersInit = {
        Accept: "application/vnd.github+json"
    };

    if (process.env.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    try {
        const [repoResponse, commitsResponse] = await Promise.all([
            fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}`, {
                headers,
                cache: "force-cache"
            }),
            fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/commits?per_page=1`, {
                headers,
                cache: "force-cache"
            })
        ]);

        if (!repoResponse.ok || !commitsResponse.ok) {
            return fallback;
        }

        const repoData = (await repoResponse.json()) as GithubRepoResponse;
        const commitData = (await commitsResponse.json()) as GithubCommitResponse;
        const formattedCommitDate = formatDate(commitData[0]?.commit?.author?.date);

        return {
            stars: repoData.stargazers_count ?? fallback.stars,
            language: repoData.language ?? fallback.language,
            lastCommit: formattedCommitDate ?? fallback.lastCommit
        };
    } catch {
        return fallback;
    }
}

export async function getGithubStatsMap(projects: Project[]) {
    const entries = await Promise.all(projects.map(async (project) => [project.slug, await getGithubStats(project)] as const));
    return Object.fromEntries(entries) as Record<string, GithubStats>;
}

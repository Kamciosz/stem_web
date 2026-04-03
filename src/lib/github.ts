import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export interface GitHubRepoStats {
  stars: number;
  lastCommitDate: string | null;
  lastCommitMessage: string | null;
  languages: Record<string, number>;
  description: string | null;
}

export async function getRepoStats(
  repoUrl: string
): Promise<GitHubRepoStats | null> {
  try {
    // Parse "owner/repo" from URL like https://github.com/Owner/Repo
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return null;

    const owner = match[1];
    const repo = match[2].replace(/\.git$/, "");

    const [repoData, commitsData, languagesData] = await Promise.all([
      octokit.rest.repos.get({ owner, repo }),
      octokit.rest.repos.listCommits({ owner, repo, per_page: 1 }),
      octokit.rest.repos.listLanguages({ owner, repo }),
    ]);

    const lastCommit = commitsData.data[0];

    return {
      stars: repoData.data.stargazers_count,
      lastCommitDate: lastCommit?.commit?.committer?.date ?? null,
      lastCommitMessage: lastCommit?.commit?.message ?? null,
      languages: languagesData.data,
      description: repoData.data.description,
    };
  } catch (error) {
    console.error("Failed to fetch GitHub stats:", error);
    return null;
  }
}

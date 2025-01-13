import { Octokit } from "@octokit/rest";

export const saveToGitHub = async (content: string) => {
  const token = localStorage.getItem("github_token");
  const owner = localStorage.getItem("github_owner");
  const repo = localStorage.getItem("github_repo");

  if (!token || !owner || !repo) {
    throw new Error("GitHub configuration not found");
  }

  const octokit = new Octokit({
    auth: token,
  });

  const filename = `diagram-${Date.now()}.mmd`;
  
  try {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: `diagrams/${filename}`,
      message: `Add diagram: ${filename}`,
      content: btoa(content), // Using browser's built-in btoa instead of Buffer
    });
  } catch (error) {
    console.error("Failed to save to GitHub:", error);
    throw error;
  }
};
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
});

export const saveToGitHub = async (content: string) => {
  const filename = `diagram-${Date.now()}.mmd`;
  
  try {
    await octokit.repos.createOrUpdateFileContents({
      owner: import.meta.env.VITE_GITHUB_OWNER,
      repo: import.meta.env.VITE_GITHUB_REPO,
      path: `diagrams/${filename}`,
      message: `Add diagram: ${filename}`,
      content: Buffer.from(content).toString("base64"),
    });
  } catch (error) {
    console.error("Failed to save to GitHub:", error);
    throw error;
  }
};
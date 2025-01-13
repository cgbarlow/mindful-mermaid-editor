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
    const response = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: `diagrams/${filename}`,
      message: `Add diagram: ${filename}`,
      content: btoa(content),
    });

    if (!response || response.status !== 201) {
      throw new Error(`Unexpected response: ${response?.status}`);
    }

    return response;
  } catch (error: any) {
    console.error("Failed to save to GitHub:", error);
    // Include response data in the error if available
    if (error.response?.data) {
      error.message = `${error.message} - ${JSON.stringify(error.response.data)}`;
    }
    throw error;
  }
}
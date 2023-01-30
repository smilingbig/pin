import { URL } from "node:url";
import { join } from "node:path";
import { get } from "./request";

interface GitlabType {
  projects: (searchTerm: string) => Promise<any>;
  mergeRequests: (
    projectId: number,
    userId: string,
    branchName: string
  ) => Promise<any>;
  user: () => Promise<any>;
  pipelines: (projectId: number, branchName: string) => Promise<any>;
}

export class GitlabIntegration implements GitlabType {
  private url: URL;

  constructor() {
    this.url = new URL("https://gitlab.com/");
    this.url.searchParams.append(
      "private_token",
      process.env.GITLAB_READ_TOKEN!.toString()
    );
  }

  buildUrl({ pathname = "" }): URL {
    this.url.pathname = "/api/v4/";

    if (pathname) {
      this.url.pathname = join(this.url.pathname, pathname);
    }

    return this.url;
  }

  public async user() {
    const result = await get(this.buildUrl({ pathname: "user" }).href);
    return result;
  }

  public async projects(searchTerm: string) {
    const url = this.buildUrl({ pathname: "projects" });
    url.searchParams.append("search", searchTerm);

    return get(url.href);
  }

  public async mergeRequests(projectId: number, branchName: string) {
    const url = this.buildUrl({
      pathname: `projects/${projectId}/merge_requests`,
    });
    url.searchParams.append("source_branch", branchName);

    return get(url.href);
  }

  public async pipelines(projectId: number, branchName: string) {
    const url = this.buildUrl({
      pathname: `projects/${projectId}/pipelines`,
    });
    url.searchParams.append("ref", branchName);
    url.searchParams.append("order_by", "updated_at");

    return get(url.href);
  }
}

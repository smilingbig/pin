import { URL } from "node:url";
import { join } from "node:path";
import axios, { AxiosResponse } from "axios";
import * as dotenv from "dotenv";
// import { ErrorMessage } from "./errors";

dotenv.config();

interface GitlabType {
  projects: (searchTerm: string) => Promise<AxiosResponse<any, any>>;
  mergeRequests: (
    projectId: number,
    userId: string,
    branchName: string
  ) => Promise<AxiosResponse<any, any>>;
  user: () => Promise<AxiosResponse<any, any>>;
  pipelines: (
    username: string,
    projectId: number,
    branchName: string
  ) => Promise<AxiosResponse<any, any>>;
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
    const result = await axios(this.buildUrl({ pathname: "user" }).href);
    return result;
  }

  public async projects(searchTerm: string) {
    const url = this.buildUrl({ pathname: "projects" });
    url.searchParams.append("search", searchTerm);

    return axios(url.href);
  }

  public async mergeRequests(
    projectId: number,
    userId: string,
    branchName: string
  ) {
    const url = this.buildUrl({
      pathname: `projects/${projectId}/merge_requests`,
    });
    url.searchParams.append("author_id", userId);
    url.searchParams.append("source_branch", branchName);

    return axios(url.href);
  }

  public async pipelines(
    username: string,
    projectId: number,
    branchName: string
  ) {
    const url = this.buildUrl({
      pathname: `projects/${projectId}/pipelines`,
    });
    url.searchParams.append("username", username);
    url.searchParams.append("ref", branchName);
    url.searchParams.append("order_by", "updated_at");
    url.searchParams.append("sort", "asc");

    return axios(url.href);
  }
}

import { execSync } from "node:child_process";

export class Git {
  static branch() {
    return execSync("git rev-parse --abbrev-ref HEAD")
      .toString("utf-8")
      .trim()
      .replace(/"/g, "");
  }

  static remoteOriginUrl() {
    return execSync("git config --get remote.origin.url")
      .toString("utf-8")
      .trim()
      .replace(/.*:|\.git/g, "");
  }

  static projectNameFromRemoteOriginUrl(remoteOriginUrl: string) {
    const splitResult = remoteOriginUrl.split("/");

    return splitResult[splitResult.length - 1].trim();
  }

  static getUserName(): string {
    return execSync("git config --get user.email").toString("utf-8").trim();
  }
}

import { Git } from "../src/git";

describe("Git", () => {
  it("should export Git", () => {
    expect(Git).toBeDefined();
  });

  it("should fetch current git branch", () => {
    const result = Git.branch();
    expect(result).not.toContain('"');
  });

  it("should fetch current git branch", () => {
    const result = Git.remoteOriginUrl();
    expect(result).not.toContain(".git");
  });

  it("should fetch current git branch", () => {
    const result = Git.projectNameFromRemoteOriginUrl(Git.remoteOriginUrl());
    expect(result).toBe("pin");
  });
});

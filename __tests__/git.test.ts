import { Git } from "../src/git";

describe("GIT", () => {
  it("should export GIT", () => {
    expect(Git).toBeDefined();
  });

  it("should fetch current git branch", () => {
    const result = Git.branch();
    expect(result).toBe("main");
  });

  it("should fetch current git branch", () => {
    const result = Git.remoteOriginUrl();
    // TODO
    // THis will need to be updated, this is just custom jank
    expect(result).toBe("test");
  });

  it.todo("should detect if the branch has changed");
});

import { GitlabIntegration } from "../src/gitlab";

let gi: GitlabIntegration;

function setupGitlabIntegration() {
  gi = new GitlabIntegration();
}

describe.skip("Gitlab", () => {
  beforeAll(setupGitlabIntegration);

  describe("GenerateUrl", () => {
    it("should create a gitlab base url", () => {
      expect(gi.buildUrl({}).href).toStrictEqual(
        "https://gitlab.com/api/v4/?private_token=glpat-qiRayws3y6k8Leyz61LG"
      );
    });

    it("should support pathname", () => {
      expect(gi.buildUrl({ pathname: "test" }).href).toStrictEqual(
        "https://gitlab.com/api/v4/test?private_token=glpat-qiRayws3y6k8Leyz61LG"
      );
    });
  });

  it("should export GitlabIntegration", () => {
    expect(GitlabIntegration).toBeDefined();
  });

  it("should search for project by project name", async () => {
    const result = await gi.projects("settlement-service-aws-stacks");

    expect(result.status).toEqual(200);
    expect(result.data[0].id).toEqual(29578217);
  });

  it("should get current user name", async () => {
    const result = await gi.user();

    expect(result.data.username).toBe("RCargill");
  });

  it("should get user piplines by project id", async () => {
    const user = await gi.user();
    const project = await gi.projects(
      "dunelm/product/backend-services/settlement-service-aws-stacks"
    );
    const pipelines = await gi.pipelines(
      user.data.username,
      project.data[0].id,
      "CREO-NA-docs"
    );

    expect(pipelines.data[0].id).toBe(744300067);
  });

  it("should print all merge requests for user", async () => {
    const project = await gi.projects("settlement-service-aws-stacks");
    const user = await gi.user();
    const mergeRequests = await gi.mergeRequests(
      project.data[0].id,
      user.data.id,
      "CREO-NA-docs"
    );

    expect(mergeRequests.data).toEqual([]);
  });

  it.todo("should print the latest pipeline for the current branch in gitlab");
  it.todo("should print the MR for the current project branch if there is any");
  it.todo("should print the current branch compare against the main branch");
  it.todo("should check if auth tokens are setup correctly");
});

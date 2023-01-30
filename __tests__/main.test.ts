import { main } from "../src/main";

describe("main", () => {
  it("should export main", () => {
    expect(main).toBeDefined();
  });

  it("should export main", () => {
    expect(main(["pipeline"])).toBeDefined();
  });

  it.todo("should open latest pipeline for current repo");
  it.todo("should open latest merge request for current repo");
  it.todo(
    "should open compare view between current repo and main/master branch"
  );
  it.todo("should open all merge requests for specified user");
  it.todo("should open current jira ticket for branch");
  it.todo("should display help when requested for if commands are incorrect");
});

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
});

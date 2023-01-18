import { Repository } from "../src/repo";

let r: Repository;

function setupRepository() {
  r = new Repository();
}

function dropRepository() {
  r.end();
}

describe("repo", () => {
  beforeAll(setupRepository);
  afterAll(dropRepository);

  it("should export repo", () => {
    expect(Repository).toBeDefined();
  });

  it("create values in database", () => {
    r.update("key", "value");
    expect(r.db["key"]).toEqual("value");
  });

  it("update values in database", () => {
    expect(r.db["key"]).toEqual("value");
    r.update("key", "new value");
    expect(r.db["key"]).toEqual("new value");
  });

  it("remove values from database", () => {
    r.remove("key");
    expect(r.db["key"]).toBeUndefined();
  });
});

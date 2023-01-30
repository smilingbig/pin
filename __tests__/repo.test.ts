import { Repository } from "../src/repo";

let r: Repository;

function setupRepository() {
  r = new Repository("");
}

describe("repo", () => {
  beforeAll(setupRepository);

  it("should export repo", () => {
    expect(Repository).toBeDefined();
  });

  it("create values in database", () => {
    r.update("key", "value");
    expect(r.query("key")).toBe("value");
  });

  it("should return true if key is found and false if not", () => {
    expect(r.has("key")).toBeTruthy();
    expect(r.has("missing_key")).toBeFalsy();
  });

  it("update values in database", () => {
    expect(r.query("key")).toBe("value");
    r.update("key", "new value");
    expect(r.query("key")).toBe("new value");
  });

  it("remove values from database", () => {
    expect(r.query("key")).toBe("new value");
    r.remove("key");
    expect(r.query("key")).toBeUndefined();
  });

  it("should use a cached value before running call back if available", async () => {
    const value = "new value";
    r.update("key", value);
    const mockFn = jest.fn();

    expect(await r.cacheOr("key", mockFn)).toBe(value);
    expect(mockFn).not.toBeCalled();
  });

  it("should call the fn callback if no value is present", async () => {
    const value = "other new return value";
    r.remove("key");
    const mockFn = jest.fn().mockReturnValue(value);

    expect(await r.cacheOr("key", mockFn)).toBe(value);
    expect(mockFn).toBeCalledTimes(1);
  });

  it.todo("should write when you call end");
  it.todo("cacheOr should work with promises and functions");
  it.todo(
    "should not read or write from file when instantiated with an empty path"
  );
});

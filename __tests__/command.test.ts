import { Command } from "../src/command";

describe("Command", () => {
  it("should export Command", () => {
    expect(Command).toBeDefined();
  });

  it("should parse command line arguments into an object", () => {
    const args = ["foo", "--bar=baz", "-u=bar", "-t=foo"];

    const c = new Command(args);

    expect(c.name).toBe("foo");
    expect(c.opt.foo).toBeTruthy();
    expect(c.opt.bar).toBe("baz");
    expect(c.opt.u).toBe("bar");
    expect(c.opt.t).toBe("foo");
  });

  it("should handle no arguments found", () => {
    const c = new Command([]);

    expect(c.name).toBeUndefined();
    expect(c.opt).toStrictEqual({});
  });

  it.todo("should accept input from stdin");
  it.todo("should display list of options to select from");
});

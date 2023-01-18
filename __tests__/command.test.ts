import { Command } from "../src/command";

describe("Command", () => {
  it("should export Command", () => {
    expect(Command).toBeDefined();
  });

  it("should parse command line arguments into an object", () => {
    const args = ["foo", "--bar=baz", "-u=bar", "-t=foo"];

    const c = new Command(args);

    expect(c.opt.foo).toBeTruthy();
    expect(c.opt.bar).toBe("baz");
    expect(c.opt.u).toBe("bar");
    expect(c.opt.t).toBe("foo");
  });
});

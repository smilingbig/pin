import { Logger } from "../src/logger";

describe("Logger", () => {
  it("should export Logger", () => {
    expect(Logger).toBeDefined();
  });

  it.todo("should not log unless debug is enabled");
  it.todo("should log on info");
  it.todo("should log errors on error");
  it.todo("should append to file when end is called");
});

import { appendFileSync } from "node:fs";
import { join } from "node:path";

export class Logger {
  logPath = join(__dirname, "../data/logs.txt");
  logs: string[] = [];
  debug = false;

  constructor({ debug }: { debug: boolean }) {
    this.debug = debug;
  }

  error(log: string) {
    this.logs.push(log);
    console.error(log);
  }

  end() {
    appendFileSync(this.logPath, this.logs.join("\n"));
  }
}

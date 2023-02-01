import { appendFileSync } from "node:fs";
import { join } from "node:path";

export class Logger {
  logPath = join(__dirname, "../data/logs.txt");
  logs: string[] = [];
  debug = false;

  constructor({ debug }: { debug: boolean }) {
    this.debug = debug;
  }

  info(log: string) {
    if (this.debug) {
      console.log(log);
    }

    this.logs.push(log);
  }

  error(log: string) {
    if (this.debug) {
      console.trace(log);
    }

    this.logs.push(log);
  }

  end() {
    appendFileSync(this.logPath, this.logs.join("\n"));
  }
}

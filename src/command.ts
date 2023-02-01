import { Message } from "./messages";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { execSync } from "node:child_process";

export class Command {
  argv: string[];
  public opt: Record<string, string>;
  name: string;

  constructor(args: string[]) {
    this.argv = args;
    this.opt = this.parse(this.argv);
    this.name = this.argv[0];
  }

  parse(args: string[]) {
    return args.reduce((accu, current) => {
      // eslint-disable-next-line prefer-const
      let [key, value] = current.split("=");
      key = key.replace(/^-[-]?/g, "");

      return {
        ...accu,
        [key]: value || true,
      };
    }, {});
  }

  static async read(question = "") {
    const rl = readline.createInterface({ input, output });
    const answer = await rl.question(question);

    rl.close();

    return answer;
  }

  static async selectFrom<T>(list: T[], key: keyof T, extract: keyof T) {
    Command.print([
      Message.MULTIPLE_RESULTS,
      ...list.map((p: T, index) => index + " " + p[key]),
    ]);

    const index = await Command.read();
    return list[+index][extract];
  }

  static print(messages: string[]) {
    messages.map((x) => console.log(x));
  }

  static open(href: string) {
    Command.print(["opening -> " + href]);
    execSync("open " + href);
  }
}

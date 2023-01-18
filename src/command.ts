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

  static open(href: string) {
    console.log("opening " + href);
    execSync("open " + href);
  }
}

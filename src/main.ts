import { Command } from "./command";
import { GitlabIntegration } from "./gitlab";
import { AWSIntegration } from "./aws";
import { Git } from "./git";
import { Repository } from "./repo";
import { Logger } from "./logger";
import { ErrorMessage, Message } from "./messages";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { version } from "../package.json";
import { head, isGreaterThan, isEmpty } from "./utils";

const r = new Repository();
const l = new Logger();

export async function main(argv: string[]) {
  const c = new Command(argv);
  const gi = new GitlabIntegration();
  const ai = new AWSIntegration({});

  l.debug = Boolean(c.opt["debug"]);

  switch (c.name) {
    case "stack": {
      let stackId: string;

      const branch = Git.branch();
      const computedKey = "stackName" + branch;

      if (r.has(computedKey)) {
        const stackName = r.query("stackName");

        const { Stacks } = await ai.stacksByName(stackName);

        stackId = head(Stacks!).StackId!;
      } else {
        await r.cacheOr(computedKey, async () => {
          const { Stacks } = await ai.getAllStacks();

          const stack =
            Stacks?.find((x) =>
              x.StackName?.toLowerCase()?.includes(branch.toLowerCase())
            ) || false;

          if (!stack)
            return Command.print(["StackName", ErrorMessage.NO_RESULTS]);

          stackId = stack.StackId || "";

          return stack.StackName;
        });
      }

      Command.open(
        "https://eu-west-1.console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/stackinfo?stackId=" +
          stackId!
      );
      break;
    }
    case "compare": {
      const branchTo = c.opt["branch"];

      if (!branchTo) return Command.print([Message.REQUIRED_BRANCH]);

      const branchFrom = Git.branch();
      const remoteOriginUrl = await r.cacheOr("remoteOriginUrl", () =>
        Git.remoteOriginUrl()
      );

      const projectId = await r.cacheOr("projectId", async () => {
        const project = await gi.projects(
          Git.projectNameFromRemoteOriginUrl(remoteOriginUrl)
        );

        if (isEmpty(project)) return Command.print([ErrorMessage.NO_RESULTS]);

        return !isGreaterThan(project, 1)
          ? head(project).id
          : await Command.selectFrom(project, "name_with_namespace", "id");
      });

      const result = await gi.compare(projectId, branchFrom, branchTo);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Command.open(result!.web_url);
      break;
    }

    case "pipeline": {
      const branch = Git.branch();
      const remoteOriginUrl = await r.cacheOr("remoteOriginUrl", () =>
        Git.remoteOriginUrl()
      );

      const projectId = await r.cacheOr("projectId", async () => {
        const project = await gi.projects(
          Git.projectNameFromRemoteOriginUrl(remoteOriginUrl)
        );

        if (isEmpty(project)) return Command.print([ErrorMessage.NO_RESULTS]);

        return !isGreaterThan(project, 1)
          ? head(project).id
          : await Command.selectFrom(project, "name_with_namespace", "id");
      });

      const pipelines = await gi.pipelines(projectId, branch);

      if (isEmpty(pipelines)) return Command.print([ErrorMessage.NO_RESULTS]);

      Command.open(head(pipelines).web_url);
      break;
    }

    case "merge_request": {
      const branch = Git.branch();
      const remoteOriginUrl = await r.cacheOr("remoteOriginUrl", () =>
        Git.remoteOriginUrl()
      );

      const projectId = await r.cacheOr("projectId", async () => {
        const project = await gi.projects(
          Git.projectNameFromRemoteOriginUrl(remoteOriginUrl)
        );

        if (isEmpty(project)) return Command.print([ErrorMessage.NO_RESULTS]);

        return !isGreaterThan(project, 1)
          ? head(project).id
          : await Command.selectFrom(project, "name_with_namespace", "id");
      });

      const mergeRequests = await gi.mergeRequests(projectId, branch);

      if (isEmpty(mergeRequests))
        return Command.print([ErrorMessage.NO_RESULTS]);

      Command.open(mergeRequests[0].web_url);
      break;
    }

    case "-v":
    case "--version":
    case "version":
      l.info(version);
      break;

    default:
      l.error(ErrorMessage.UNKNOWN_COMMAND);
  }

  return Promise.resolve();
}

(async () => {
  if (require.main === module) {
    console.time("Process");
    try {
      await main(process.argv.splice(2));
    } catch (e) {
      l.error((e as string).toString());
    }
    console.timeEnd("Process");

    r.end();
    l.end();
  }
})();

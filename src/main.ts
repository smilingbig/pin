import { Command } from "./command";
import { GitlabIntegration } from "./gitlab";
import { Git } from "./git";
import { Repository } from "./repo";
import { Logger } from "./logger";
import { ErrorMessage } from "./messages";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { version } from "../package.json";
import { head, isGreaterThan, isEmpty } from "./utils";

const r = new Repository();
const l = new Logger();

export async function main(argv: string[]) {
  const c = new Command(argv);
  const gi = new GitlabIntegration();

  l.debug = Boolean(c.opt["debug"]);

  switch (c.name) {
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

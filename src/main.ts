import { Command } from "./command";
import { GitlabIntegration } from "./gitlab";
import { Git } from "./git";
import { Repository } from "./repo";
import { Logger } from "./logger";
import { ErrorMessage } from "./errors";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { version } from "../package.json";

const l = new Logger({ debug: true });
const r = new Repository();

export async function main(argv: string[]) {
  const c = new Command(argv);
  const gi = new GitlabIntegration();

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
        return project[0].id;
      });

      const pipelines = await gi.pipelines(projectId, branch);

      if (!pipelines.length) return l.error(ErrorMessage.NO_RESULTS);

      Command.open(pipelines[0].web_url);
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
        return project[0].id;
      });

      const mergeRequests = await gi.mergeRequests(projectId, branch);

      if (!mergeRequests.length) return l.error(ErrorMessage.NO_RESULTS);

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

import { Command } from "./command";
import { GitlabIntegration } from "./gitlab";
import { Git } from "./git";
import { Repository } from "./repo";
import { Logger } from "./logger";
import { ErrorMessage } from "./errors";

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

      const username = await r.cacheOr("username", async () => {
        const user = await gi.user();
        return user.data.username;
      });

      const projectId = await r.cacheOr("projectId", async () => {
        const project = await gi.projects(
          Git.projectNameFromRemoteOriginUrl(remoteOriginUrl)
        );
        return project.data[0].id;
      });

      const pipelines = await gi.pipelines(username, projectId, branch);

      if (!pipelines.data.length) l.error(ErrorMessage.NO_RESULTS);
      Command.open(pipelines.data[0].web_url);
      break;
    }

    case "merge_request": {
      const branch = Git.branch();
      const remoteOriginUrl = await r.cacheOr("remoteOriginUrl", () =>
        Git.remoteOriginUrl()
      );

      const userId = await r.cacheOr("userId", async () => {
        const user = await gi.user();
        return user.data.id;
      });

      const projectId = await r.cacheOr("projectId", async () => {
        const project = await gi.projects(
          Git.projectNameFromRemoteOriginUrl(remoteOriginUrl)
        );
        return project.data[0].id;
      });

      const mergeRequests = await gi.mergeRequests(projectId, userId, branch);

      if (!mergeRequests.data.length) l.error(ErrorMessage.NO_RESULTS);
      Command.open(mergeRequests.data[0].web_url);
      break;
    }

    default:
      l.error(ErrorMessage.UNKNOWN_COMMAND);
  }

  return true;
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

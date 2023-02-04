import { execSync } from "node:child_process";
import { Git } from "./git";

export class JiraIntegration {
  private url = "https://dunelmmcdev.atlassian.net/rest/api";
  username: string;
  password = process.env.JIRA_TOKEN!;

  constructor() {
    this.username = Git.getUserName();
  }

  ticket(jql: string) {
    const curlCommand = `curl -v --url '${this.url}/2/search?jql=project="CREO"&summary~${jql}' --user "${this.username}:${this.password}" --header 'Accept: application/json' --header 'Content-Type: application/json'`;
    console.log("curl", curlCommand);
    const result = execSync(curlCommand);

    return JSON.parse(result.toString());
  }
}

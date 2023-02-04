import {
  CloudFormationClient,
  CloudFormationClientConfig,
  DescribeStacksCommand,
} from "@aws-sdk/client-cloudformation";
import { fromIni } from "@aws-sdk/credential-providers";

export class AWSIntegration {
  client: CloudFormationClient;

  constructor(config: CloudFormationClientConfig) {
    this.client = new CloudFormationClient({
      ...config,
      region: "eu-west-1",
      credentials: fromIni({ profile: "dunqa" }),
    });
  }

  async getAllStacks() {
    return await this.client.send(new DescribeStacksCommand({}));
  }

  async stacksByName(stackName: string) {
    const input = { StackName: stackName };

    const command = new DescribeStacksCommand(input);
    const response = await this.client.send(command);

    return response;
  }
}

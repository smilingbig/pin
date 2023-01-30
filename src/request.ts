import * as https from "node:https";

export async function get(path: string): Promise<any[]> {
  const handlePromise = (resolve: any, reject: any) => {
    const res: any[] = [];

    const handleError = (err: any) => {
      reject(err);
    };

    https
      .get(path, (response) => {
        const handleData = (chunk: any) => {
          res.push(chunk);
        };

        response.setEncoding("utf8");
        response.on("data", handleData);
        response.on("error", handleError);
        response.on("timeout", handleError);
        response.on("end", () => {
          resolve(JSON.parse(res.join("")));
        });
      })
      .on("error", handleError);
  };

  return new Promise(handlePromise);
}

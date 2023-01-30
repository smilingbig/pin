import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Database = Record<string, string>;

interface RepoType {
  end: () => void;
  query: (query: string) => string;
  remove: (query: string) => Database;
  update: (query: string, data: string) => Database;
  has: (query: string) => boolean;
  cacheOr: (query: string, callback: () => any) => any;
}

export class Repository implements RepoType {
  dbPath: string;
  public db: Database;

  constructor(dbPath = "../data/db.json") {
    this.dbPath = dbPath ? join(__dirname, dbPath) : "";
    const data = dbPath && readFileSync(this.dbPath).toString("utf-8");
    this.db = JSON.parse(data ? data : "{}");
  }

  public end() {
    console.log("dbpath", this.dbPath);
    console.log("db", this.db);
    writeFileSync(this.dbPath, JSON.stringify(this.db));
  }

  public remove(query: string) {
    delete this.db[this.generateKey(query)];
    return this.db;
  }

  public query(query: string) {
    return this.db[this.generateKey(query)];
  }

  public has(query: string) {
    const key = this.generateKey(query);
    return Boolean(this.db[key]);
  }

  public update(query: string, data: string) {
    this.db[this.generateKey(query)] = data;
    return this.db;
  }

  private generateKey(query: string) {
    return process.cwd() + "_" + query;
  }

  public async cacheOr(query: string, callback: () => any) {
    if (this.has(query)) return this.query(query);
    else {
      const result = await callback();
      this.update(query, result);
      return result;
    }
  }
}

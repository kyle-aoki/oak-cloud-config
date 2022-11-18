import { OakFile, OakObject } from "./types";
import AppConfig from "../environment";
import { PathJoin } from "../util/path";

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit | undefined): Promise<T> {
  const resp = await fetch(input, init);
  const json = await resp.json();
  console.log('request:', input, json);
  return json;
}

export default class OakApi {
  static host: string = AppConfig.OakApiHost;

  static async getObjects(path: string[]): Promise<OakObject[]> {
    return fetchJson(`${OakApi.host}/objects?parent=${PathJoin(path)}`);
  }

  static async getFile(object: OakObject): Promise<OakFile> {
    return fetchJson(`${OakApi.host}/content?object=${object.id}`);
  }

  static async upgradeFile(file: OakFile): Promise<OakFile> {
    return fetchJson(`${OakApi.host}/upgrade`, {
      method: "POST",
      body: JSON.stringify(file),
    });
  }

  static async newFile(object: OakObject): Promise<OakObject> {
    return fetchJson(`${OakApi.host}/new-file`, {
      method: "POST",
      body: JSON.stringify(object),
    });
  }

  static async newFolder(object: OakObject): Promise<OakObject> {
    return fetchJson(`${OakApi.host}/new-folder`, {
      method: "POST",
      body: JSON.stringify(object),
    });
  }
}

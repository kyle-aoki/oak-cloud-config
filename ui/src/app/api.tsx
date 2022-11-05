import { OakFile, OakObject } from "./types";

async function fetchJson<T>(input: RequestInfo | URL, init ?: RequestInit | undefined): Promise<T> {
  console.log(input);
  const resp = await fetch(input, init);
  const json = await resp.json();
  console.log(json);
  return json;
}

export default class OakApi {
  static host: string = "http://localhost:8080";

  static async getObjects(path: string[]): Promise<OakObject[]> {
    const strPath = `/${path.join('/')}`;
    return fetchJson(`${OakApi.host}/objects?parent=${strPath}`);
  }

  static async getContent(object: OakObject): Promise<OakFile> {
    return fetchJson(`${OakApi.host}/content?object=${object.id}`);
  }
}

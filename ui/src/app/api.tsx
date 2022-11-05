import { OakJson, OakObject } from "./types";

async function fetchJson<T>(input: RequestInfo | URL, init ?: RequestInit | undefined): Promise<T> {
  console.log(input);
  const resp = await fetch(input, init);
  const json = await resp.json();
  console.log(json);
  return json;
}

export default class OakApi {
  static host: string = "http://localhost:8080";

  static async findObjects(path: string): Promise<OakObject[]> {
    return fetchJson(`${OakApi.host}/objects?path=${path}`);
  }

  static async findContent(object: OakObject): Promise<OakJson> {
    return fetchJson(`${OakApi.host}/content?object=${object.id}`);
  }
}

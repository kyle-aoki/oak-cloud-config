export interface OakUser {
  id: number;
  username: string;
}

export interface OakObject {
  id: number;
  parent: string;
  name: string;
  isJson: boolean;
}

export interface OakJson {
  id: number
  content: string
}

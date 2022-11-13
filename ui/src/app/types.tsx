import React from "react";

export interface OakObject {
  id: number;
  parent: string;
  name: string;
  isFile: boolean;
}

export interface OakFile {
  id: number;
  content: string;
  version: number;
  isCommitted: boolean;
}

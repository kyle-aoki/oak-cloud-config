import React from "react";

export interface MainState {
  loading: boolean;
  path: string[];
  objects: OakObject[];
  fileClicked: OakObject | null;
  folderClicked: OakObject | null;
  oldContent: string;
  openFile: OakFile | null;
  readOnly: boolean;
  editing: boolean;
  commitFile: boolean;
}

export type SetMainState = React.Dispatch<React.SetStateAction<MainState>>;

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

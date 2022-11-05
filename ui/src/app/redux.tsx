import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { OakJson, OakObject } from "./types";

export interface MainState {
  workbench: OakObject[];
  path: string;
  open: OakObject | null;
  Json: OakJson | null;
  modifying: boolean;
}

const initialState: MainState = {
  workbench: [],
  path: "/",
  open: null,
  Json: null,
  modifying: false,
};

export function RemoveEmpty(sArr: string[]): string[] {
  const newArr = [];
  for (let i = 0; i < sArr.length; i++) {
    if (sArr[i] != "") newArr.push(sArr[i])
  }
  return newArr;
}

export function PopPath(str: string): string {
  let parts = str.split("/")
  parts = RemoveEmpty(parts)
  console.log(parts)
  if (parts.length <= 1) {
    return "/"
  }
  parts.pop()
  return `/${parts.join('/')}`;
}

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    objectClick: (state: MainState, action: PayloadAction<string>) => {
      const strLen = state.path.length;
      if (state.path[strLen - 1] === "/") {
        state.path += `${action.payload}`;
      } else {
        state.path += `/${action.payload}`;
      }
    },
    popPath: (state: MainState) => {
      if (state.path.endsWith('.json'))
      state.path = PopPath(state.path)
    },
    setObjects: (state: MainState, action: PayloadAction<OakObject[]>) => {
      state.workbench = action.payload;
    },
    updateObjects: (state: MainState, action: PayloadAction<string>) => {
    },
    getContent: (state: MainState, action: PayloadAction<OakObject>) => {
      state.open = action.payload;
      state.path += `/${action.payload.name}`
    },
    setContent: (state: MainState, action: PayloadAction<OakJson>) => {
      state.Json = action.payload;
    },
    startModifying: (state: MainState) => {
      state.modifying = true
    },
    stopModifying: (state: MainState) => {
      state.modifying = false
    },
  }
});


export const { objectClick, popPath, setObjects, updateObjects, setContent, getContent } = mainSlice.actions;
export default mainSlice.reducer;

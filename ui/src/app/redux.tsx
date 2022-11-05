import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { OakJson, OakObject } from "./types";

export interface MainState {
  workbench: OakObject[];
  path: string;
  Json: OakJson;
}

const initialState: MainState = {
  workbench: [],
  path: "/",
  Json: { id: 0, content: "" }
};

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
      while (state.path[state.path.length - 1] !== "/") {
        state.path = state.path.substring(0, state.path.length - 1);
      }
    },
    setObjects: (state: MainState, action: PayloadAction<OakObject[]>) => {
      state.workbench = action.payload;
    },
    updateObjects: (state: MainState, action: PayloadAction<string>) => {
    },
    getContent: (state: MainState, action: PayloadAction<number>) => {},
    setContent: (state: MainState, action: PayloadAction<OakJson>) => {
      state.Json = action.payload;
    }
  }
});


export const { objectClick, popPath, setObjects, updateObjects, setContent, getContent } = mainSlice.actions;
export default mainSlice.reducer;

import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { OakFile, OakObject } from "./types";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export interface MainState {
  objects: OakObject[];
  path: string[];
  OakObject: OakObject | null;
  OakFile: OakFile | null;
  isEditing: boolean;
}

const initialState: MainState = {
  objects: [],
  path: [],
  OakObject: null,
  OakFile: null,
  isEditing: false,
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    getObjects: (state: MainState, action: PayloadAction<string[]>) => {
      state.path = action.payload;
    },
    folderClick: (state: MainState, action: PayloadAction<string>) => {
      state.path = [...state.path, action.payload];
    },
    changeDirectoryDown: (state: MainState) => {
      state.path.pop()
    },
    setObjects: (state: MainState, action: PayloadAction<OakObject[]>) => {
      state.objects = action.payload;
    },
    getFile: (state: MainState, action: PayloadAction<OakObject>) => {
      state.OakObject = action.payload;
    },
    setFile: (state: MainState, action: PayloadAction<OakFile>) => {
      state.OakFile = action.payload;
    },
    startModifying: (state: MainState) => {
      state.isEditing = true
    },
    stopModifying: (state: MainState) => {
      state.isEditing = false
    },
  }
});

export const useMainState = ():MainState => useSelector((state: RootState) => state.main);
export const { setObjects, getObjects, getFile, setFile, changeDirectoryDown } = mainSlice.actions;
export default mainSlice.reducer;

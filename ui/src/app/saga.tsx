import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import OakApi from './api'
import type { PayloadAction } from "@reduxjs/toolkit";
import { getFile, setFile, setObjects, getObjects, changeDirectoryDown } from "./redux";
import { OakFile, OakObject } from "./types";

function* setObjectsSaga(action: PayloadAction<string[]>) {
  try {
    const objs: OakObject[] = yield call(OakApi.getObjects, action.payload);
    yield put(setObjects(objs));
  } catch (e) {
    console.log(e)
  }
}

function* setFileSaga(action: PayloadAction<OakObject>) {
  try {
    const oakFile: OakFile = yield call(OakApi.getContent, action.payload);
    yield put(setFile(oakFile));
  } catch (e) {
    console.log(e)
  }
}

export function* SagaList() {
  yield takeEvery(getObjects.type, setObjectsSaga);
  yield takeEvery(changeDirectoryDown.type, setObjectsSaga)
  yield takeEvery(getFile.type, setFileSaga)
}

import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import OakApi from './api'
import type { PayloadAction } from "@reduxjs/toolkit";
import { getContent, setContent, setObjects, updateObjects } from "./redux";
import { OakJson, OakObject } from "./types";

function* fetchObjects(action: PayloadAction<string>) {
  try {
    const objs: OakObject[] = yield call(OakApi.findObjects, action.payload);
    yield put(setObjects(objs));
  } catch (e) {
    console.log(e)
    yield put(setObjects([]));
  }
}

function* fetchContent(action: PayloadAction<number>) {
  try {
    const Json: OakJson = yield call(OakApi.findContent, action.payload);
    yield put(setContent(Json));
  } catch (e) {
    console.log(e)
    yield put(setContent({ id: 0, content: ""}));
  }
}

export function* mySaga() {
  const actionType = updateObjects("").type
  yield takeEvery(actionType, fetchObjects);
  const triggerFetchContent = getContent(0).type
  yield takeEvery(triggerFetchContent, fetchContent)
}

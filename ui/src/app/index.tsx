import Editor from "@monaco-editor/react";
import React, { useState } from "react";
import { MainState } from "./types";
import { MainHooks, TextEditor, Workbench } from "./classes";
import {
  AppBodyPane,
  AppPane,
  Chip,
  CommitButton,
  Inner,
  MenuButton,
  Navbar,
  NewVersionButton,
  Outer,
  PathBar,
  TextEditorBar,
  TextEditorCenter,
  TextEditorLeftSide,
  TextEditorPane,
  TextEditorRightSide,
  WorkBenchControl,
  WorkbenchPane
} from "./styled-components";
import { WorkbenchObject } from "../workbench-object";

export default function App() {

  const [state, setState] = useState<MainState>({
    loading: false,
    path: [],
    objects: [],
    fileClicked: null,
    folderClicked: null,
    openFile: null,
    readOnly: true,
    editing: false,
    commitFile: false
  });

  const mainHooks = new MainHooks(state, setState);
  const workbench = new Workbench(state, setState);
  const textEditor = new TextEditor(state, setState);

  mainHooks.useLoadFile();
  mainHooks.useLoadDirectory();
  mainHooks.useCommitFile();

  console.log(state);

  return (
    <AppPane>
      <Navbar>TeamSafe Cloud Config</Navbar>
      <PathBar>{`/${state.path.join("/")}`}</PathBar>
      <AppBodyPane>
        <WorkbenchPane>
          <WorkBenchControl>
            <MenuButton
              onClick={() => workbench.changeDirDown()}>..</MenuButton>
          </WorkBenchControl>
          {
            state.objects.map((obj, idx) => {
              return <WorkbenchObject key={idx} object={obj}
                                      openObject={state.fileClicked}
                                      workbench={workbench} />;
            })
          }
        </WorkbenchPane>
        <TextEditorPane>
          <TextEditorBar>
            <TextEditorLeftSide>
              <MenuButton>copy</MenuButton>
              <Chip
                visible={Boolean(state.openFile) && state.readOnly}
              >read-only</Chip>
              <Chip visible={Boolean(state.openFile)}>
                v{state.openFile?.version}
              </Chip>
            </TextEditorLeftSide>
            <TextEditorCenter></TextEditorCenter>
            <TextEditorRightSide>
              {
                state.editing ?
                  <>
                    <CommitButton
                      onClick={() => textEditor.commit()}>commit
                    </CommitButton>
                    <CommitButton
                      onClick={() => {}}>cancel
                    </CommitButton>
                  </>
                  :
                  <NewVersionButton onClick={() => textEditor.newVersion()}>new
                    version
                  </NewVersionButton>
              }
            </TextEditorRightSide>
          </TextEditorBar>
          <Outer>
            <Inner>
              <Editor
                onChange={(str) => textEditor.onTextEditorChange(str)}
                theme="vs-dark"
                defaultLanguage="json"
                defaultValue=""
                value={state.openFile?.content || ""}
                options={{ readOnly: state.readOnly }}
              />
            </Inner>
          </Outer>
        </TextEditorPane>
      </AppBodyPane>
    </AppPane>
  );
}



import Editor from "@monaco-editor/react";
import React, { useState } from "react";
import { MainState } from "./types";
import { MainHooks, NewObjectCreator, TextEditor, Workbench } from "./classes";
import {
  AppBodyPane,
  AppPane,
  CancelButton,
  Chip,
  CommitButton,
  EmptyWorkbench,
  Inner,
  MenuButton,
  Navbar,
  NewVersionButton,
  NewVersionChip,
  Outer,
  PathBar,
  ReadOnlyChip,
  TextEditorBar,
  TextEditorCenter,
  TextEditorLeftSide,
  TextEditorPane,
  TextEditorRightSide,
  WorkBenchControl,
  WorkbenchPane,
  WritingChip,
} from "./styled-components";
import { WorkbenchObject } from "../workbench-object";
import { NewObject } from "../workbench-object/new-object";

export default function App() {
  const [state, setState] = useState<MainState>({
    path: [],
    objects: [],

    loading: false,
    shouldRefreshWorkbench: false,
    readOnly: true,
    editing: false,
    commitFile: false,
    cancelChange: false,
    creatingNewObject: false,
    commitNewObject: false,

    oldContent: "",

    fileClicked: null,
    openFile: null,
    folderClicked: null,
    newObject: null,
  });

  const mainHooks = new MainHooks(state, setState);
  const workbench = new Workbench(state, setState);
  const textEditor = new TextEditor(state, setState);
  const newObjectCreator = new NewObjectCreator(state, setState);

  mainHooks.useLoadFile();
  mainHooks.useLoadDirectory();
  mainHooks.useCommitFile();
  mainHooks.useCancelChange();
  const ref = mainHooks.useFocusNewObjectInput();
  mainHooks.useAcceptObjectNameWithEnterKeyWhileCreatingObject();
  mainHooks.useCreateNewObject();
  mainHooks.useShouldRefreshDirectory();

  console.log(state);

  return (
    <>
      <AppPane>
        <Navbar>TeamSafe Cloud Config</Navbar>
        <PathBar>{`/${state.path.join("/")}`}</PathBar>
        <AppBodyPane>
          <WorkbenchPane>
            <WorkBenchControl>
              <MenuButton onClick={() => workbench.changeDirDown()}>
                ..
              </MenuButton>
              <MenuButton
                onClick={() => newObjectCreator.startCreating("folder")}
              >
                📁 +
              </MenuButton>
              <MenuButton
                onClick={() => newObjectCreator.startCreating("file")}
              >
                📄 +
              </MenuButton>
            </WorkBenchControl>
            {state.creatingNewObject && (
              <NewObject newObjectCreator={newObjectCreator} ref={ref} />
            )}
            {state.objects.length === 0 && state.path.length > 0 ? (
              <EmptyWorkbench>empty</EmptyWorkbench>
            ) : (
              state.objects.map((obj, idx) => {
                return (
                  <WorkbenchObject
                    key={idx}
                    object={obj}
                    openObject={state.fileClicked}
                    workbench={workbench}
                  />
                );
              })
            )}
          </WorkbenchPane>
          <TextEditorPane>
            <TextEditorBar>
              <TextEditorLeftSide>
                {Boolean(state.openFile) && <MenuButton>copy</MenuButton>}
                <>
                  {Boolean(state.openFile) &&
                    (state.readOnly ? (
                      <ReadOnlyChip>read-only</ReadOnlyChip>
                    ) : (
                      <WritingChip>writing</WritingChip>
                    ))}
                  {state.editing && (
                    <>
                      <NewVersionChip>
                        v{(state.openFile?.version as number) - 1} {"-->"} v
                        {state.openFile?.version}
                      </NewVersionChip>
                    </>
                  )}
                  {state.openFile && !state.editing && (
                    <>
                      <Chip>v{state.openFile?.version}</Chip>
                    </>
                  )}
                </>
              </TextEditorLeftSide>
              <TextEditorCenter></TextEditorCenter>
              <TextEditorRightSide>
                {Boolean(state.openFile) &&
                  (state.editing ? (
                    <>
                      <CommitButton
                        $committed={state.commitFile}
                        onClick={() => textEditor.commit()}
                      >
                        commit
                      </CommitButton>
                      <CancelButton onClick={() => textEditor.cancel()}>
                        cancel
                      </CancelButton>
                    </>
                  ) : (
                    <NewVersionButton onClick={() => textEditor.newVersion()}>
                      new version
                    </NewVersionButton>
                  ))}
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
    </>
  );
}

import Editor from "@monaco-editor/react";
import React, { useState } from "react";

import { MainHooks } from "./main-hooks";
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
import { initWorkbench, Workbench, WorkbenchState } from "./workbench";
import { initTextEditor, TextEditor, TextEditorState } from "./text-editor";
import { CreatorInput, CreatorInputState, initCreatorInput } from "./creator-input";
import { BarLoader } from "react-spinners";
import { BarLoaderColor } from "../constants";

export default function App() {
  const workbench = new Workbench(useState<WorkbenchState>(initWorkbench));
  const textEditor = new TextEditor(useState<TextEditorState>(initTextEditor));
  const creatorInput = new CreatorInput(useState<CreatorInputState>(initCreatorInput));

  const mainHooks = new MainHooks(creatorInput, workbench, textEditor);

  mainHooks.useLoadFile();
  mainHooks.useLoadDirectory();
  mainHooks.useCommitFile();
  const ref = mainHooks.useFocusNewObjectInput();
  mainHooks.useAcceptObjectNameWithEnterKeyWhileCreatingObject();
  mainHooks.useCreateNewObject();
  mainHooks.useShouldRefreshDirectory();

  console.log("workbench", workbench.state);
  console.log("textEditor", textEditor.state);
  console.log("creatorInput", creatorInput.state);

  return (
    <>
      <AppPane>
        <Navbar>TeamSafe Cloud Config</Navbar>
        <PathBar>{`/${workbench.state.path.join("/")}`}</PathBar>
        <AppBodyPane>
          <WorkbenchPane>
            <WorkBenchControl>
              <MenuButton onClick={() => workbench.changeDirDown()}>..</MenuButton>
              <MenuButton
                onClick={() => creatorInput.startCreating(workbench.state.path, "folder")}
              >
                📁 +
              </MenuButton>
              <MenuButton onClick={() => creatorInput.startCreating(workbench.state.path, "file")}>
                📄 +
              </MenuButton>
              <MenuButton>🗑️</MenuButton>
            </WorkBenchControl>
            {workbench.state.loading ? (
              <BarLoader width={"100%"} color={BarLoaderColor.color} height={2} />
            ) : (
              <div style={{ height: "2px" }} />
            )}
            {workbench.state.objects.length === 0 && workbench.state.path.length > 0 ? (
              <EmptyWorkbench>empty</EmptyWorkbench>
            ) : (
              workbench.state.objects
                .sort((a, b) => a.name.localeCompare(b.name))
                .sort((a, b) => Number(a.isFile) - Number(b.isFile))
                .map((obj, idx) => {
                  return (
                    <WorkbenchObject
                      key={idx}
                      object={obj}
                      openObject={workbench.state.fileClicked}
                      workbench={workbench}
                      textEditor={textEditor}
                    />
                  );
                })
            )}
            {creatorInput.state.creatingNewObject && (
              <NewObject creatorInput={creatorInput} ref={ref} />
            )}
          </WorkbenchPane>
          <TextEditorPane>
            <TextEditorBar>
              <TextEditorLeftSide>
                {Boolean(textEditor.state.openFile) && <MenuButton>copy</MenuButton>}
                <>
                  {Boolean(textEditor.state.openFile) &&
                    (textEditor.state.readOnly ? (
                      <ReadOnlyChip>read-only</ReadOnlyChip>
                    ) : (
                      <WritingChip>writing</WritingChip>
                    ))}
                  {textEditor.state.editing && (
                    <>
                      <NewVersionChip>v{textEditor.state.openFile?.version}</NewVersionChip>
                    </>
                  )}
                  {textEditor.state.openFile && !textEditor.state.editing && (
                    <>
                      <Chip>v{textEditor.state.openFile?.version}</Chip>
                    </>
                  )}
                </>
              </TextEditorLeftSide>
              <TextEditorCenter></TextEditorCenter>
              <TextEditorRightSide>
                {Boolean(textEditor.state.openFile) &&
                  (textEditor.state.editing ? (
                    <>
                      <CommitButton
                        $committed={textEditor.state.commitFile}
                        onClick={() => textEditor.commit()}
                      >
                        commit
                      </CommitButton>
                      <CancelButton onClick={() => textEditor.cancel()}>cancel</CancelButton>
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
                  value={textEditor.state.openFile?.content || ""}
                  options={{ readOnly: textEditor.state.readOnly }}
                />
              </Inner>
            </Outer>
          </TextEditorPane>
        </AppBodyPane>
      </AppPane>
    </>
  );
}

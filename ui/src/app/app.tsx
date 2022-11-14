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
import { WorkbenchObject } from "../workbench-object/wbo";
import { NewObject } from "../workbench-object/new-object";
import { initWorkbench, Workbench, WorkbenchState } from "./workbench";
import { initTextEditor, TextEditor, TextEditorState } from "./text-editor";
import { CreatorInput, CreatorInputState, initCreatorInput } from "./creator-input";
import { BarLoader, ScaleLoader } from "react-spinners";
import { BarLoaderColor } from "../colors";

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
                onClick={() => creatorInput.startFolderCreation(workbench.state.path)}
              >
                📁 +
              </MenuButton>
              <MenuButton onClick={() => creatorInput.startFileCreation(workbench.state.path)}>
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
                .map((obj) => {
                  return (
                    <WorkbenchObject
                      key={obj.id}
                      object={obj}
                      openObject={workbench.state.fileClicked}
                      workbench={workbench}
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
                {Boolean(textEditor.state.openFile) && <MenuButton>📋</MenuButton>}
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
                        {textEditor.state.commitFile ? (
                          <ScaleLoader height={8} width={6} color={"white"} speedMultiplier={2} />
                        ) : (
                          "commit"
                        )}
                      </CommitButton>
                      <CancelButton onClick={() => textEditor.cancel()}>cancel</CancelButton>
                    </>
                  ) : (
                    <NewVersionButton onClick={() => textEditor.newVersion()}>
                      New Version
                    </NewVersionButton>
                  ))}
              </TextEditorRightSide>
            </TextEditorBar>
            <Outer>
              <Inner>
                {Boolean(textEditor.state.openFile) ? (
                  <Editor
                    onChange={(str) => textEditor.onTextEditorChange(str)}
                    theme="vs-dark"
                    defaultLanguage="json"
                    defaultValue=""
                    value={textEditor.state.openFile?.content || ""}
                    options={{ readOnly: textEditor.state.readOnly }}
                  />
                ) : (
                  <></>
                )}
              </Inner>
            </Outer>
          </TextEditorPane>
        </AppBodyPane>
      </AppPane>
    </>
  );
}

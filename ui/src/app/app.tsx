import React, { useState } from "react";

import { MainHooks } from "./main-hooks";
import {
  AppBodyPane,
  AppPane,
  Navbar,
  PathBar,
  TextEditorPane,
  WorkbenchPane,
} from "./styled-components";
import { CreatorInput, CreatorInputState, initCreatorInput } from "./creator-input";
import { TextEditorTsx } from "../text-editor/component";
import { TextEditorControlTsx } from "../text-editor-control/component";
import { initTextEditor, TextEditor, TextEditorState } from "../text-editor/class";
import { WorkbenchTsx } from "../workbench/component";
import { initWorkbench, Workbench, WorkbenchState } from "../workbench/class";

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
            <WorkbenchTsx workbench={workbench} creatorInput={creatorInput} ref={ref} />
          </WorkbenchPane>
          <TextEditorPane>
            <TextEditorControlTsx textEditor={textEditor} />
            <TextEditorTsx textEditor={textEditor} />
          </TextEditorPane>
        </AppBodyPane>
      </AppPane>
    </>
  );
}

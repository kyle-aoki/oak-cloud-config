import { Inner, Outer } from "../app/styled-components";
import Editor from "@monaco-editor/react";
import React, { FC } from "react";
import { TextEditor } from "./class";

export const TextEditorTsx: FC<{ textEditor: TextEditor }> = ({ textEditor}) => {
  return (
    <>
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
    </>
  );
};

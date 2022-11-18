import {
  CancelButton,
  Chip,
  CommitButton,
  MenuButton,
  NewVersionButton,
  NewVersionChip,
  ReadOnlyChip,
  TextEditorBar,
  TextEditorCenter,
  TextEditorLeftSide,
  TextEditorRightSide,
  WritingChip,
} from "../app/styled-components";
import { ScaleLoader } from "react-spinners";
import React, { FC } from "react";
import { TextEditor } from "../text-editor/class";

export const TextEditorControlTsx: FC<{ textEditor: TextEditor }> = ({ textEditor }) => {
  return (
    <>
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
    </>
  );
};

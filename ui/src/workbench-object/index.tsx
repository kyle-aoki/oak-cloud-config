import { OakObject } from "../app/types";

import React, { ReactElement } from "react";
import styled from "styled-components";
import { GrayBackground, ObjectActive, ObjectHover, ObjectSelectedBg } from "../constants";
import { Workbench } from "../app/workbench";
import { TextEditor } from "../app/text-editor";

export const WorkbenchObject = ({
  object,
  workbench,
  textEditor,
}: {
  object: OakObject;
  openObject: OakObject | null;
  workbench: Workbench;
  textEditor: TextEditor;
}): ReactElement => {
  return (
    <>
      <ObjectPane
        $loading={workbench.state.loading}
        onClick={() => workbench.onObjectClick(object)}
        object={object}
        workbench={workbench}
        textEditor={textEditor}
      >
        {object.isFile ? "📄" : "📁"}{' '}
        {object.name}
      </ObjectPane>
    </>
  );
};

export const ObjectPane = styled.div<{
  $loading: boolean;
  object: OakObject;
  workbench: Workbench;
  textEditor: TextEditor;
}>`
  padding-left: 10px;
  background-color: ${GrayBackground};
  color: white;
  display: flex;
  width: 100%;
  padding-top: 2px;
  padding-bottom: 2px;
  user-select: none;

  background-color: ${({ $loading, object, workbench, textEditor }) => {
    if (object.id === textEditor.state.openFile?.id) {
      return ObjectSelectedBg;
    }
    if (
      $loading &&
      (object.id === workbench.state.folderClicked?.id ||
        object.id === workbench.state.fileClicked?.id)
    ) {
      return ObjectActive;
    }
    return "transparent";
  }};

  &:hover {
    background-color: ${({ $loading, object, workbench, textEditor }) => {
      if (object.id === textEditor.state.openFile?.id) return ObjectSelectedBg;
      if (
        $loading &&
        (object.id === workbench.state.folderClicked?.id ||
          object.id === workbench.state.fileClicked?.id)
      ) {
        return ObjectActive;
      }
      return ObjectHover;
    }};
  }

  &:active {
    background-color: ${ObjectActive};
  }
`;

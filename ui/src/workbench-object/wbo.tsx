import { OakObject } from "../app/types";

import React, { ReactElement } from "react";
import styled from "styled-components";
import { GrayBackground, ObjectActive, ObjectHover, ObjectSelectedBg } from "../colors";
import { Workbench } from "../app/workbench";
import { TextEditor } from "../app/text-editor";

export const WorkbenchObject = ({
  object,
  workbench,
}: {
  object: OakObject;
  openObject: OakObject | null;
  workbench: Workbench;
}): ReactElement => {
  return (
    <>
      <ObjectPane
        $loading={workbench.state.loading}
        onClick={() => workbench.onObjectClick(object)}
        object={object}
        workbench={workbench}
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
}>`
  padding-left: 10px;
  background-color: ${GrayBackground};
  color: white;
  display: flex;
  width: 100%;
  padding-top: 2px;
  padding-bottom: 2px;
  user-select: none;

  background-color: ${({ $loading, object, workbench }) => {
    if (object.id === workbench.state.fileClicked?.id) {
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
    background-color: ${({ $loading, object, workbench }) => {
      if (object.id === workbench.state.fileClicked?.id) return ObjectSelectedBg;
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

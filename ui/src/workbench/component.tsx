import React, { ForwardedRef, forwardRef } from "react";
import { EmptyWorkbench, MenuButton, WorkBenchControl } from "../app/styled-components";
import { BarLoader } from "react-spinners";
import { BarLoaderColor } from "../colors";
import { WorkbenchObject } from "../workbench-object/workbench-object";
import { NewObject } from "../workbench-object/new-object";
import { Workbench } from "./class";
import { CreatorInput } from "../app/creator-input";

export const WorkbenchTsx = forwardRef(
  (
    {
      workbench,
      creatorInput,
    }: {
      workbench: Workbench;
      creatorInput: CreatorInput;
    },
    ref: ForwardedRef<any>
  ) => {
    return (
      <>
        <WorkBenchControl>
          <MenuButton onClick={() => workbench.changeDirDown()}>..</MenuButton>
          <MenuButton onClick={() => creatorInput.startFolderCreation(workbench.state.path)}>
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
      </>
    );
  }
);

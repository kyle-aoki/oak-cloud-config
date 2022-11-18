import { RefObject, useCallback, useEffect, useRef } from "react";
import OakApi from "./oak-api";
import { CreatorInput } from "./creator-input";
import { TextEditor } from "../text-editor/class";
import { Workbench } from "../workbench/class";

export class MainHooks {
  creatorInput: CreatorInput;
  workbench: Workbench;
  textEditor: TextEditor;

  constructor(creatorInput: CreatorInput, workbench: Workbench, textEditor: TextEditor) {
    this.creatorInput = creatorInput;
    this.workbench = workbench;
    this.textEditor = textEditor;
  }

  /** Update workbench when path changes. */
  useLoadDirectory = () => {
    useEffect(() => {
      (async () => {
        const objects = await OakApi.getObjects(this.workbench.state.path);
        this.workbench.updateObjects(objects);
      })();
    }, [this.workbench.state.path]);
  };

  /** Load file when fileClicked changes. */
  useLoadFile = () => {
    useEffect(() => {
      (async () => {
        if (this.workbench.state.fileClicked === null) return;
        const file = await OakApi.getFile(this.workbench.state.fileClicked);
        this.textEditor.loadFile(file);
        this.workbench.stopLoading();
      })();
    }, [this.workbench.state.fileClicked]);
  };

  useCommitFile = () => {
    useEffect(() => {
      (async () => {
        if (!this.textEditor.state.commitFile) return;
        if (!this.textEditor.state.openFile) return;
        await OakApi.upgradeFile(this.textEditor.state.openFile);
        this.textEditor.commitFile();
      })();
    }, [this.textEditor.state.commitFile]);
  };

  useFocusNewObjectInput = (): RefObject<HTMLInputElement> => {
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
      if (inputRef === null || inputRef.current === null) return;
      inputRef.current.focus();
    }, [inputRef, this.creatorInput.state.creatingNewObject]);
    return inputRef;
  };

  useAcceptObjectNameWithEnterKeyWhileCreatingObject = () => {
    const handleEnterPress = useCallback(
      (event: KeyboardEvent) => {
        if (!this.creatorInput.state.creatingNewObject) return;
        if (event.key === "Enter") {
          this.creatorInput.acceptObject();
          this.workbench.startLoading();
        }
      },
      [this.creatorInput.state]
    );
    useEffect(() => {
      window.addEventListener("keydown", handleEnterPress);
      return () => {
        window.removeEventListener("keydown", handleEnterPress);
      };
    }, [handleEnterPress, this.creatorInput.state.creatingNewObject]);
  };

  useCreateNewObject = () => {
    useEffect(() => {
      (async () => {
        if (!this.creatorInput.state.commitNewObject) return;
        if (this.creatorInput.state.newObject === null) return;
        if (this.creatorInput.state.newObject.isFile) {
          await OakApi.newFile(this.creatorInput.state.newObject);
        } else {
          await OakApi.newFolder(this.creatorInput.state.newObject);
        }
        const objects = await OakApi.getObjects(this.workbench.state.path);
        await this.workbench.refreshDirectory(objects);
        await this.creatorInput.finishCreatingObject();
        this.workbench.stopLoading();
      })();
    }, [this.creatorInput.state.commitNewObject]);
  };

  useShouldRefreshDirectory = () => {
    useEffect(() => {
      (async () => {
        if (!this.workbench.state.shouldRefresh) return;
        const objects = await OakApi.getObjects(this.workbench.state.path);
        this.workbench.refreshDirectory(objects);
      })();
    }, [this.workbench.state.shouldRefresh]);
  };
}

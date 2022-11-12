import { ChangeEvent, RefObject, useCallback, useEffect, useRef } from "react";
import OakApi from "./oak-api";
import { MainState, OakObject, SetMainState } from "./types";
import { PathJoin } from "../util/path";

export class Stateful<State, SetState> {
  state: State;
  setState: SetState;

  constructor(state: State, setState: SetState) {
    this.state = state;
    this.setState = setState;
  }
}

export class MainHooks extends Stateful<MainState, SetMainState> {
  /** Update workbench when path changes. */
  useLoadDirectory = () => {
    useEffect(() => {
      (async () => {
        const objects = await OakApi.getObjects(this.state.path);
        this.setState({ ...this.state, loading: false, objects });
      })();
    }, [this.state.path]);
  };

  /** Load file when fileClicked changes. */
  useLoadFile = () => {
    useEffect(() => {
      (async () => {
        if (this.state.fileClicked === null) return;
        const file = await OakApi.getFile(this.state.fileClicked);
        this.setState({ ...this.state, loading: false, openFile: file });
      })();
    }, [this.state.fileClicked]);
  };

  useCommitFile = () => {
    useEffect(() => {
      (async () => {
        if (!this.state.commitFile) return;
        if (!this.state.openFile) return;
        await OakApi.upgradeFile(this.state.openFile);
        this.setState({
          ...this.state,
          commitFile: false,
          editing: false,
        });
      })();
    }, [this.state.commitFile]);
  };

  useCancelChange = () => {
    useEffect(() => {
      (async () => {
        if (!this.state.openFile) return;
        if (!this.state.cancelChange) return;
        this.setState({
          ...this.state,
          cancelChange: false,
          openFile: {
            ...this.state.openFile,
            content: this.state.oldContent,
          },
        });
      })();
    }, [this.state.cancelChange]);
  };

  useFocusNewObjectInput = (): RefObject<HTMLInputElement> => {
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
      if (inputRef === null || inputRef.current === null) return;
      console.log("here");
      inputRef.current.focus();
    }, [inputRef, this.state.creatingNewObject]);
    return inputRef;
  };

  useAcceptObjectNameWithEnterKeyWhileCreatingObject = () => {
    const handleEnterPress = useCallback(
      (event: KeyboardEvent) => {
        console.log("callbacking");
        if (event.key === "Enter") {
          this.setState({
            ...this.state,
            creatingNewObject: false,
            commitNewObject: true,
          });
        }
      },
      [this.state]
    );
    useEffect(() => {
      window.addEventListener("keydown", handleEnterPress);
      return () => {
        window.removeEventListener("keydown", handleEnterPress);
      };
    }, [handleEnterPress]);
  };

  useCreateNewObject = () => {
    useEffect(() => {
      (async () => {
        if (!this.state.commitNewObject) return;
        if (this.state.newObject === null) return;
        if (this.state.newObject.isFile) {
          await OakApi.newFile(this.state.newObject);
        } else {
          await OakApi.newFolder(this.state.newObject);
        }
        this.setState({
          ...this.state,
          commitNewObject: false,
          shouldRefreshWorkbench: true,
        });
      })();
    }, [this.state.commitNewObject]);
  };

  useShouldRefreshDirectory = () => {
    useEffect(() => {
      (async () => {
        if (!this.state.shouldRefreshWorkbench) return;
        const objects = await OakApi.getObjects(this.state.path);
        this.setState({
          ...this.state,
          shouldRefreshWorkbench: false,
          objects,
        });
      })();
    }, [this.state.shouldRefreshWorkbench]);
  };
}

export class Workbench extends Stateful<MainState, SetMainState> {
  onObjectClick(object: OakObject) {
    if (this.state.loading) return;
    if (object.isFile) {
      this.setState({
        ...this.state,
        loading: true,
        fileClicked: object,
        editing: false,
        readOnly: true,
      });
      return;
    }
    const path = [...this.state.path, object.name];
    this.setState({
      ...this.state,
      loading: true,
      folderClicked: object,
      path,
    });
  }

  changeDirDown() {
    if (this.state.path.length === 0) return;
    if (this.state.loading) return;
    this.state.path.pop();
    const path = [...this.state.path];
    this.setState({ ...this.state, loading: true, path });
  }
}

export class TextEditor extends Stateful<MainState, SetMainState> {
  newVersion() {
    if (!this.state.openFile || !this.state.openFile.version) return;
    this.setState({
      ...this.state,
      editing: true,
      readOnly: false,
      oldContent: this.state.openFile.content,
      openFile: {
        ...this.state.openFile,
        version: this.state.openFile.version + 1,
      },
    });
  }

  onTextEditorChange(str: string | undefined) {
    if (str === undefined) return;
    if (this.state.openFile === null) return;
    if (this.state.readOnly) return;
    this.state.openFile.content = str;
    this.setState({
      ...this.state,
      openFile: {
        ...this.state.openFile,
        content: str,
      },
    });
  }

  commit() {
    if (this.state.commitFile) return;
    this.setState({
      ...this.state,
      commitFile: true,
      readOnly: true,
    });
  }

  cancel() {
    if (this.state.commitFile) return;
    if (!this.state.editing) return;
    if (!this.state.openFile || !this.state.openFile.version) return;
    this.setState({
      ...this.state,
      readOnly: true,
      editing: false,
      cancelChange: true,
      openFile: {
        ...this.state.openFile,
        version: this.state.openFile.version - 1,
      },
    });
  }
}

export class NewObjectCreator extends Stateful<MainState, SetMainState> {
  startCreating(objectType: "folder" | "file") {
    this.setState({
      ...this.state,
      creatingNewObject: true,
      newObject: {
        id: 0,
        name: "",
        parent: PathJoin(this.state.path),
        isFile: objectType === "file",
      },
    });
  }

  updateObjectName(e: ChangeEvent<HTMLInputElement>) {
    if (this.state.newObject === null) return;
    this.setState({
      ...this.state,
      newObject: { ...this.state.newObject, name: e.target.value },
    });
  }

  cancelCreating() {
    this.setState({ ...this.state, creatingNewObject: false });
  }

  commit() {
    this.setState({ ...this.state, commitNewObject: true });
  }
}

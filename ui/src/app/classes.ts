import { useEffect } from "react";
import OakApi from "./oak-api";
import { MainState, OakObject, SetMainState } from "./types";

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
          editing: false
        });
      })();
    }, [this.state.commitFile]);
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
        readOnly: true
      });
      return;
    }
    const path = [...this.state.path, object.name];
    this.setState({
      ...this.state,
      loading: true,
      folderClicked: object,
      path
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
        version: this.state.openFile.version + 1
      }
    });
  }

  onTextEditorChange(str: string | undefined) {
    if (str === undefined) return;
    if (this.state.openFile === null) return;
    if (this.state.readOnly) return;
    this.state.openFile.content = str;
    this.setState({
      ...this.state,
      openFile: { ...this.state.openFile, content: str }
    });
  }

  commit() {
    if (this.state.commitFile) return;
    this.setState({
      ...this.state,
      commitFile: true,
      readOnly: true
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
      openFile: {
        ...this.state.openFile,
        content: this.state.oldContent,
        version: this.state.openFile.version - 1
      }
    });
  }

  turnOnReadOnly() {
  }

  turnOffReadOnly() {
  }

}

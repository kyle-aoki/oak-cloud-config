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

}

export class Workbench extends Stateful<MainState, SetMainState> {

  onObjectClick(object: OakObject) {
    if (this.state.loading) return;
    if (object.isFile) {
      this.setState({ ...this.state, loading: true, fileClicked: object, readOnly: true });
      return;
    }
    const path = [...this.state.path, object.name];
    this.setState({ ...this.state, loading: true, folderClicked: object, path });
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
  }

  onTextEditorChange(str: string | undefined) {
    if (str === undefined) return;
    if (this.state.openFile === null) return;
    if (this.state.readOnly) return;
    this.state.openFile.content = str;
    this.setState({ ...this.state, openFile: { ...this.state.openFile, content: str } });
  }

  turnOnReadOnly() {
  }

  turnOffReadOnly() {
  }

}

import { OakFile } from "../app/types";
import { Stateful } from "../util/stateful-class";

export interface TextEditorState {
  oldContent: string;
  openFile: OakFile | null;
  readOnly: boolean;
  editing: boolean;
  commitFile: boolean;
}

export const initTextEditor: TextEditorState = {
  readOnly: true,
  editing: false,
  commitFile: false,
  oldContent: "",
  openFile: null,
};

export class TextEditor extends Stateful<TextEditorState> {
  loadFile(file: OakFile) {
    this.setState({ ...this.state, openFile: file });
  }

  commitFile() {
    this.setState({ ...this.state, commitFile: false, editing: false });
  }

  newVersion() {
    if (this.state.openFile === null) return;
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
      openFile: {
        ...this.state.openFile,
        version: this.state.openFile.version - 1,
        content: this.state.oldContent,
      },
    });
  }
}

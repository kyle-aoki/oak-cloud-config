import { OakObject } from "../app/types";
import { Stateful } from "../util/stateful-class";

export interface WorkbenchState {
  loading: boolean;
  shouldRefresh: boolean;
  path: string[];
  objects: OakObject[];
  fileClicked: OakObject | null;
  folderClicked: OakObject | null;
}

export const initWorkbench: WorkbenchState = {
  path: [],
  objects: [],
  loading: false,
  shouldRefresh: false,
  fileClicked: null,
  folderClicked: null,
};

export class Workbench extends Stateful<WorkbenchState> {
  refreshDirectory(objects: OakObject[]) {
    this.setState({ ...this.state, shouldRefresh: false, objects });
  }

  updateObjects(objects: OakObject[]) {
    this.setState({ ...this.state, loading: false, objects });
  }

  stopLoading() {
    this.setState({ ...this.state, loading: false });
  }

  startLoading() {
    this.setState({ ...this.state, loading: true });
  }

  onObjectClick(object: OakObject) {
    object.isFile ? this.onFileClick(object) : this.onFolderClick(object);
  }

  private onFolderClick(object: OakObject) {
    if (this.state.loading) return;
    const path = [...this.state.path, object.name];
    this.setState({ ...this.state, loading: true, fileClicked: null, folderClicked: object, path });
  }

  private onFileClick(object: OakObject) {
    if (this.state.loading) return;
    if (this.state.fileClicked && this.state.fileClicked.id === object.id) return;
    this.setState({
      ...this.state,
      loading: true,
      folderClicked: null,
      fileClicked: object,
    });
    return;
  }

  changeDirDown() {
    if (this.state.path.length === 0) return;
    if (this.state.loading) return;
    this.state.path.pop();
    const path = [...this.state.path];
    this.setState({ ...this.state, loading: true, path });
  }
}

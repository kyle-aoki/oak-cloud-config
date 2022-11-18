import { OakObject } from "./types";
import { PathJoin } from "../util/path";
import { ChangeEvent } from "react";
import { Stateful } from "../util/stateful-class";

export interface CreatorInputState {
  cancelChange: boolean;
  creatingNewObject: boolean;
  commitNewObject: boolean;
  newObject: OakObject | null;
}

export const initCreatorInput: CreatorInputState = {
  cancelChange: false,
  creatingNewObject: false,
  commitNewObject: false,
  newObject: null,
};

export class CreatorInput extends Stateful<CreatorInputState> {
  async finishCreatingObject() {
    this.setState({ ...this.state, commitNewObject: false });
  }

  acceptObject() {
    this.setState({ ...this.state, creatingNewObject: false, commitNewObject: true });
  }

  startFileCreation(path: string[]) {
    this.setState({
      ...this.state,
      creatingNewObject: true,
      newObject: {
        id: 0,
        name: "",
        parent: PathJoin(path),
        isFile: true,
      },
    });
  }

  startFolderCreation(path: string[]) {
    this.setState({
      ...this.state,
      creatingNewObject: true,
      newObject: {
        id: 0,
        name: "",
        parent: PathJoin(path),
        isFile: false,
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

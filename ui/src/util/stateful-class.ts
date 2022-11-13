import { Dispatch, SetStateAction } from "react";

export class Stateful<T> {
  state: T;
  setState: Dispatch<SetStateAction<T>>;

  constructor(useState: UseState<T>) {
    this.state = useState[0];
    this.setState = useState[1];
  }
}

export type UseState<T> = [T, Dispatch<SetStateAction<T>>];

import {Pos} from "./Pos";
import {Dim} from "./Dim";

export interface Box {
  readonly p: Pos;
  readonly d: Dim;
}

export function box(p: Pos, d: Dim): Box {
  return {p, d};
}


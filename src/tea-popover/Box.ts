import {Pos} from "./Pos";
import {Dim} from "./Dim";

export class Box {
  constructor(
      readonly p: Pos,
      readonly d: Dim
  ) {
  }

}

export function box(p: Pos, d: Dim): Box {
  return new Box(p, d);
}


import {pos, Pos} from "./Pos";
import {dim, Dim} from "./Dim";

export class Box {
  constructor(
      readonly p: Pos,
      readonly d: Dim
  ) {
  }

  static fromDomRect(rect: DOMRect): Box {
    const {x, y, height, width} = rect;
    return box(pos(x,y), dim(width, height));
  }

}

export function box(p: Pos, d: Dim): Box {
  return new Box(p, d);
}


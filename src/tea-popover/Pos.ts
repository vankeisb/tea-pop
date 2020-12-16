import {Dim} from "./Dim";

export class Pos {
  constructor(
      readonly x: number,
      readonly y: number,
  ) {
  }

  add(p: Pos): Pos {
    return new Pos(
      this.x + p.x,
      this.y + p.y
    )
  }
}

export function pos(x: number, y: number): Pos {
  return new Pos(x, y);
}

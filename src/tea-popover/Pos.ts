export class Pos {
  constructor(
      readonly x: number,
      readonly y: number,
  ) {
  }
}

export function pos(x: number, y: number): Pos {
  return new Pos(x, y);
}

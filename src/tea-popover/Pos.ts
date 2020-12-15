export interface Pos {
  readonly x: number;
  readonly y: number;
}

export function pos(x: number, y: number): Pos {
  return {x, y};
}

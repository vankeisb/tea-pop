export class Dim {
  constructor(
      readonly w: number,
      readonly h: number,
  ) {
  }
}

export function dim(w: number, h: number): Dim {
  return new Dim(w, h);
}

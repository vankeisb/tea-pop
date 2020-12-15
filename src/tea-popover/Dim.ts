export interface Dim {
  readonly h: number;
  readonly w: number;
}

export function dim(w:number, h: number): Dim {
  return {h,w};
}

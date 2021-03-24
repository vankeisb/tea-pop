import {Maybe} from "tea-cup-core";
import {Dim, Pos} from "tea-pop-core";

export type PlacementMode = "menu" | "drop-down";

export interface PlacementPage {
  readonly tag: 'placement-page';
  readonly mode: PlacementMode;
  readonly viewportDim: Maybe<Dim>;
  readonly mousePos: Pos;
}

import {Maybe} from "tea-cup-core";
import {Dim} from "tea-pop-core";

export interface TooltipsPage {
  readonly tag: "tooltips-page";
  readonly viewportDim: Maybe<Dim>;
}

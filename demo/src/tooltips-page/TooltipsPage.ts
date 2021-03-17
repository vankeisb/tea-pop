import {Maybe} from "react-tea-cup";
import {Dim} from "tea-pop-core";

export interface TooltipsPage {
  readonly tag: "tooltips-page";
  readonly viewportDim: Maybe<Dim>;
}

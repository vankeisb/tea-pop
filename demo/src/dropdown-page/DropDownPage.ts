import {Maybe, Tuple} from "tea-cup-core";
import {Dim} from "tea-pop-core";
import {DropDownModel} from "tea-pop-dropdown";

export interface DropDownPage {
  readonly tag: "drop-down-page";
  readonly viewportDim: Maybe<Dim>;
  readonly indexAndModel: Maybe<Tuple<number,DropDownModel>>;
}

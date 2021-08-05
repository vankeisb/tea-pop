import {Maybe, Tuple} from "tea-cup-core";
import {Dim} from "tea-pop-core";
import {ComboBoxModel} from "tea-pop-combobox"


export interface ComboPage {
  readonly tag: "combo-page";
  readonly comboModel: ComboBoxModel<string>;
}


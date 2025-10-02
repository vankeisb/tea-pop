import { ComboBoxModel } from "tea-pop-combobox";

export interface ComboPage {
  readonly tag: "combo-page";
  readonly comboModel: ComboBoxModel<string>;
}

import {MenuPage} from "./menu-page/MenuPage";
import {DropDownPage} from "./dropdown-page/DropDownPage";
import {PlacementPage} from "./placement-page/PlacementPage";

export type Page =
  | { tag: "home" }
  | MenuPage
  | DropDownPage
  | PlacementPage

export interface Model {
  readonly page: Page;
}

export function homeModel(): Model {
  return {
    page: { tag: "home" }
  }
}

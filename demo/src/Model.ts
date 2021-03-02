import {MenuPage} from "./menu-page/MenuPage";
import {Pos} from "tea-pop-core";

export type Page =
  | { tag: "home" }
  | MenuPage

export interface Model {
  readonly page: Page;
}

export function homeModel(): Model {
  return {
    page: { tag: "home" }
  }
}

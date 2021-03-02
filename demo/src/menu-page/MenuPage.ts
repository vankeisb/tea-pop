// just to avoid too much typing
import {item, menu, Menu, Model as MenuModel, separator} from "tea-pop-menu";
import {Maybe} from "react-tea-cup";
import {Pos} from "tea-pop-core";

export type MyMenuModel = MenuModel<string>

export interface MenuPage {
  tag: 'menu';
  readonly mousePos: Pos;
  // ref to the tea-pop model
  readonly menuModel: Maybe<MyMenuModel>;
  // keep last clicked item
  readonly lastClicked: Maybe<string>;
}

export const mySubMenu2: Menu<string> = menu([
  item("Try"),
  item("Finally")
])

export const mySubMenu1: Menu<string> = menu([
  item("Do this"),
  item("Do that"),
  separator,
  item("Another sub menu...", mySubMenu2)
])

export const myMenu: Menu<string> = menu([
  item("Yalla", mySubMenu1),
  separator,
  item("Copy"),
  item("Cut"),
  item("Paste"),
  separator,
  item("I am a bit longer")
]);

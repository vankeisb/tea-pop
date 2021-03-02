import {MenuPageMsg} from "./menu-page/MenuPageMsg";
import {DropDownPageMsg} from "./dropdown-page/DropDownPageMsg";

export type Msg =
    | { tag: 'url-change'; l: Location }
    | { tag: 'menu-page-msg'; msg: MenuPageMsg }
    | { tag: 'dd-page-msg', msg: DropDownPageMsg }

export function menuPageMsg(msg: MenuPageMsg): Msg {
  return {
    tag: 'menu-page-msg',
    msg
  }
}

export function dropDownPageMsg(msg: DropDownPageMsg): Msg {
  return {
    tag: "dd-page-msg",
    msg
  }
}

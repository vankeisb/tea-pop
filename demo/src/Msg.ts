import {MenuPageMsg} from "./menu-page/MenuPageMsg";

export type Msg =
    | { tag: 'url-change'; l: Location }
    | { tag: 'menu-page-msg'; msg: MenuPageMsg }

export function menuPageMsg(msg: MenuPageMsg): Msg {
  return {
    tag: 'menu-page-msg',
    msg
  }
}

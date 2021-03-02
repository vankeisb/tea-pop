import {Msg as MenuMsg} from "tea-pop-menu";
import {Pos} from "tea-pop-core";

export type MyMenuMsg = MenuMsg<string>

export type MenuPageMsg =
    | { tag: 'menu-msg', msg: MyMenuMsg }
    | { tag: 'mouse-move', pos: Pos }
    | { tag: 'mouse-down', button: number }
    | { tag: 'key-down', key: string }

export function menuMsg(msg: MyMenuMsg): MenuPageMsg {
  return {
    tag: "menu-msg",
    msg
  }
}

export function onMouseMove(pos: Pos): MenuPageMsg {
  return {
    tag: "mouse-move", pos
  }
}

export function onKeyDown(key: string): MenuPageMsg {
  return {
    tag: "key-down", key
  }
}

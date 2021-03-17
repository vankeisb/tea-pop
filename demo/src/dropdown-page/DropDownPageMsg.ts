import {Box, Dim} from "tea-pop-core";
import {DropDownMsg} from "tea-pop-dropdown";

export type DropDownPageMsg =
    | { tag: "button-clicked", index: number; b: Box }
    | { tag: "dd-msg", msg: DropDownMsg }
    | { tag: 'got-window-dimensions', d: Dim }

export function ddMsg(msg: DropDownMsg): DropDownPageMsg {
  return {
    tag: "dd-msg",
    msg,
  }
}

export function gotWindowDimensions(d: Dim): DropDownPageMsg {
  return {
    tag: "got-window-dimensions",
    d
  }
}


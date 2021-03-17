import {Dim} from "tea-pop-core";

export type TooltipsPageMsg =
    | { tag: 'got-window-dimensions', d: Dim }

export function gotWindowDimensions(d: Dim): TooltipsPageMsg {
  return {
    tag: "got-window-dimensions",
    d
  }
}


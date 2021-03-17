import {Dim, Pos} from "tea-pop-core";

export type PlacementPageMsg =
    | { tag: 'got-window-dimensions', d: Dim }
    | { tag: 'mouse-move', pos: Pos }
    | { tag: 'key-down', key: string }

export function gotWindowDimensions(d: Dim): PlacementPageMsg {
  return {
    tag: "got-window-dimensions",
    d
  }
}

export function onMouseMove(pos: Pos): PlacementPageMsg {
  return {
    tag: "mouse-move", pos
  }
}

export function onKeyDown(key: string): PlacementPageMsg {
  return {
    tag: "key-down", key
  }
}

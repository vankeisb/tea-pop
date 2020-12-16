import {Dim} from "../tea-popover/Dim";
import {Box} from "../tea-popover/Box";
import { Result } from "react-tea-cup";

export type Msg
    = { tag: 'got-window-dimensions', d: Dim }
    | { tag: 'got-uuid', uuid: string }
    | { tag: 'got-menu-box', r: Result<Error,Box> };

export function gotWindowDimensions(d: Dim): Msg {
  return {
    tag: 'got-window-dimensions',
    d
  }
}

export function gotUuid(uuid: string): Msg {
  return {
    tag: "got-uuid",
    uuid
  }
}

export function gotMenuBox(r: Result<Error,Box>): Msg {
  return {
    tag: 'got-menu-box',
    r
  }
}

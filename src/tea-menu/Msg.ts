import {Dim} from "./Dim";
import {Box} from "./Box";
import {Result} from "react-tea-cup";
import {MenuItem} from "./Menu";

export type Msg<T>
    = { tag: 'got-window-dimensions', d: Dim }
    | { tag: 'got-uuid', uuid: string }
    | { tag: 'got-menu-box', r: Result<Error, Box> }
    | { tag: 'key-down', key: string }
    | { tag: 'mouse-move', item: MenuItem<T>, itemIndex: number }
    | { tag: 'got-item-box', item: MenuItem<T>, r: Result<Error,Box> }
    | { tag: 'child-msg', m: Msg<T> };

export function gotWindowDimensions<T>(d: Dim): Msg<T> {
  return {
    tag: 'got-window-dimensions',
    d
  }
}

export function gotUuid<T>(uuid: string): Msg<T> {
  return {
    tag: "got-uuid",
    uuid
  }
}

export function gotMenuBox<T>(r: Result<Error, Box>): Msg<T> {
  return {
    tag: 'got-menu-box',
    r
  }
}

export function gotKeyDown<T>(key: string): Msg<T> {
  return {
    tag: "key-down",
    key
  }
}

export function childMsg<T>(m: Msg<T>): Msg<T> {
  return {
    tag: 'child-msg',
    m
  }
}

export function gotItemBox<T>(item: MenuItem<T>, r: Result<Error,Box>): Msg<T> {
  return {
    tag: 'got-item-box',
    item,
    r
  }
}

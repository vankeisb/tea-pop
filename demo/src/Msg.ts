import {MenuPageMsg} from "./menu-page/MenuPageMsg";
import {DropDownPageMsg} from "./dropdown-page/DropDownPageMsg";
import {PlacementPageMsg} from "./placement-page/PlacementPageMsg";
import {Route} from "./routes";

export type Msg =
    | { tag: 'url-change'; l: Location }
    | { tag: 'menu-page-msg'; msg: MenuPageMsg }
    | { tag: 'dd-page-msg', msg: DropDownPageMsg }
    | { tag: 'placement-page-msg', msg: PlacementPageMsg }
    | { tag: 'navigate', route: Route }
    | { tag: 'noop' }

export const noop: Msg = { tag: "noop" }


export function navigate(route: Route): Msg {
  return {
    tag: "navigate",
    route
  }
}

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

export function placementPageMsg(msg: PlacementPageMsg): Msg {
  return {
    tag: "placement-page-msg",
    msg
  }
}

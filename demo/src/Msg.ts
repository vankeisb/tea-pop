import {MenuPageMsg} from "./menu-page/MenuPageMsg";
import {DropDownPageMsg} from "./dropdown-page/DropDownPageMsg";
import {PlacementPageMsg} from "./placement-page/PlacementPageMsg";
import {Route} from "./routes";
import {TooltipsPageMsg} from "./tooltips-page/TooltipsPageMsg";

export type Msg =
    | { tag: 'url-change'; l: Location }
    | { tag: 'menu-page-msg'; msg: MenuPageMsg }
    | { tag: 'dd-page-msg', msg: DropDownPageMsg }
    | { tag: 'tt-page-msg', msg: TooltipsPageMsg }
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

export function tooltipPageMsg(msg: TooltipsPageMsg): Msg {
  return {
    tag: "tt-page-msg",
    msg
  }
}

export function placementPageMsg(msg: PlacementPageMsg): Msg {
  return {
    tag: "placement-page-msg",
    msg
  }
}

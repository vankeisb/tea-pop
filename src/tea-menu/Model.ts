import {Menu} from "./Menu";
import {Maybe} from "react-tea-cup";
import {Dim} from "../tea-popover/Dim";
import {Box} from "../tea-popover/Box";
import {Pos} from "../tea-popover/Pos";

export interface Model<T> {
  readonly uuid: Maybe<string>;
  readonly windowSize: Maybe<Dim>;
  readonly menu: Menu<T>;
  readonly state: MenuState;
  readonly error: Maybe<Error>;
}

export type MenuState =
    | { tag: 'closed' }
    | { tag: 'placing', position: Pos }
    | { tag: 'open', box: Box };

export const menuStateClosed: MenuState = { tag: 'closed' };

export function menuStatePlacing(position: Pos): MenuState {
  return {
    tag: 'placing',
    position
  }
}

export function menuId(uuid: string): string {
  return `tea-menu-${btoa(uuid)}`;
}

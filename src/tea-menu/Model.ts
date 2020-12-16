import {Menu} from "./Menu";
import {Maybe} from "react-tea-cup";
import {Dim} from "./Dim";
import {Box} from "./Box";
import {Pos} from "./Pos";

export interface Model<T> {
  readonly uuid: Maybe<string>;
  readonly windowSize: Maybe<Dim>;
  readonly menu: Menu<T>;
  readonly state: MenuState;
  readonly error: Maybe<Error>;
  readonly child: Maybe<Model<T>>
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

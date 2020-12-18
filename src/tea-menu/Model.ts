import {Menu} from "./Menu";
import {Maybe, nothing} from "react-tea-cup";
import {Dim} from "./Dim";
import {Box} from "./Box";
import {Pos} from "./Pos";

export interface Model<T> {
  readonly uuid: Maybe<string>;
  readonly windowSize: Maybe<Dim>;
  readonly menu: Menu<T>;
  readonly state: MenuState;
  readonly error: Maybe<Error>;
  readonly child: Maybe<Model<T>>;
  readonly navigatedWithKeyboard: boolean;
}

export function initialModel<T>(menu: Menu<T>, position: Pos): Model<T> {
  return {
    uuid: nothing,
    windowSize: nothing,
    menu,
    state: menuStatePlacing(position),
    error: nothing,
    child: nothing,
    navigatedWithKeyboard: false,
  }
}

export type MenuState =
    | { tag: 'placing', position: Pos }
    | { tag: 'open', box: Box };

export function menuStatePlacing(position: Pos): MenuState {
  return {
    tag: 'placing',
    position
  }
}

export function keyboardNavigated<T>(model: Model<T>, navigatedWithKeyboard: boolean = true): Model<T> {
  return {...model, navigatedWithKeyboard }
}

import {Msg} from "./Msg";
import {Cmd, Dispatcher, noCmd, nothing, Sub} from "react-tea-cup";
import {Model} from "./Model";
import {Menu} from "./Menu";
import * as React from 'react';
import {ViewMenu} from "./ViewMenu";
import {ItemRenderer} from "./ItemRenderer";

export function init<T>(menu: Menu<T>): [Model<T>, Cmd<Msg>] {
  return noCmd({
    menu,
    openAt: nothing
  })
}

export function view<T>(renderer: ItemRenderer<T>, dispatch: Dispatcher<Msg>, model: Model<T>) {
  return (
      <ViewMenu model={model} dispatch={dispatch} renderer={renderer}/>
  );
}

export function update<T>(msg: Msg, model: Model<T>): [Model<T>, Cmd<Msg>] {
  return noCmd(model);
}

export function subscriptions<T>(model: Model<T>): Sub<Msg> {
  return Sub.none();
}

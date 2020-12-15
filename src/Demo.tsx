import {Cmd, Dispatcher, noCmd, Sub, map} from "react-tea-cup";
import * as React from 'react';
import {item, ItemRenderer, menu, Menu, Msg as TMsg, ViewMenu, Model as TModel, init as tInit} from "./tea-menu";

export interface Model {
  readonly menuModel: TModel<string>;
}

export type Msg = { tag: 'menu-msg', msg: TMsg }

function menuMsg(msg: TMsg): Msg {
  return {
    tag: "menu-msg",
    msg
  }
}

const myMenu: Menu<string> = menu([
  item("item1"),
  item("item2"),
  item("item3")
]);

const myRenderer: ItemRenderer<string> = item => (
    <span>{item}</span>
);

export function init(): [Model, Cmd<Msg>] {
  const mac = tInit(myMenu)
  return [
    { menuModel: mac[0] },
    mac[1].map(menuMsg)
  ]
}


export function view(dispatch: Dispatcher<Msg>, model: Model) {
  return (
      <>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          Right-click anywhere to trigger the menu
        </div>
        <ViewMenu model={model.menuModel} dispatch={map(dispatch, menuMsg)} renderer={myRenderer}/>
      </>
  )
}

export function update(msg: Msg, model: Model): [Model, Cmd<Msg>] {
  return noCmd(model);
}

export function subscriptions(model: Model): Sub<Msg> {
  return Sub.none();
}

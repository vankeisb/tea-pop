import {Cmd, Dispatcher, noCmd, Sub, map} from "react-tea-cup";
import * as React from 'react';
import {Model as TModel} from './tea-menu/Model';
import {Msg as TMsg} from './tea-menu/Msg';
import {ViewMenu} from './tea-menu/ViewMenu';
import {item, menu, Menu, separator} from "./tea-menu/Menu";
import {ItemRenderer} from "./tea-menu/ItemRenderer";
import * as TM from './tea-menu/TeaMenu';
import {Pos, pos} from "./tea-menu/Pos";
import {stopEvent} from "./tea-menu/StopEvent";

export interface Model {
  readonly menuModel: TModel<string>;
}

export type MenuMsg = TMsg<string>

export type Msg =
    | { tag: 'menu-msg', msg: MenuMsg }
    | { tag: 'mouse-down', button: number, pos: Pos }

function menuMsg(msg: MenuMsg): Msg {
  return {
    tag: "menu-msg",
    msg
  }
}

const mySubMenu2: Menu<string> = menu([
  item("Try"),
  item("Finally")
])

const mySubMenu1: Menu<string> = menu([
  item("Do this"),
  item("Do that"),
  separator,
  item("Another sub menu...", mySubMenu2)
])

const myMenu: Menu<string> = menu([
  item("Copy"),
  item("Cut"),
  item("Paste"),
  separator,
  item("Yalla", mySubMenu1),
  item("I am a bit longer")
]);

const myRenderer: ItemRenderer<string> = item => (
    <span>{item}</span>
);

export function init(): [Model, Cmd<Msg>] {
  const mac = TM.init(myMenu)
  return [
    {menuModel: mac[0]},
    mac[1].map(menuMsg)
  ]
}


export function view(dispatch: Dispatcher<Msg>, model: Model) {
  return (
      <>
        <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onContextMenu={stopEvent}
            onMouseDown={e => {
              dispatch({tag: 'mouse-down', button: e.button, pos: pos(e.pageX, e.pageY)})
            }}
        >
          Right-click anywhere to trigger the menu
        </div>
        <ViewMenu model={model.menuModel} dispatch={map(dispatch, menuMsg)} renderer={myRenderer}/>
      </>
  )
}

function withTeaMenu(model: Model, f: (mm: TModel<string>) => [TModel<string>, Cmd<MenuMsg>]): [Model, Cmd<Msg>] {
  const mac = f(model.menuModel);
  return [{...model, menuModel: mac[0]}, mac[1].map(menuMsg)];
}

export function update(msg: Msg, model: Model): [Model, Cmd<Msg>] {
  switch (msg.tag) {
    case "menu-msg": {
      return withTeaMenu(model, tm => TM.update(msg.msg, tm));
    }
    case "mouse-down": {
      return withTeaMenu(model, tm =>
          msg.button === 2 ? TM.open(tm, msg.pos) : TM.close(tm)
      );
    }
  }
}

export function subscriptions(model: Model): Sub<Msg> {
  return TM.subscriptions(model.menuModel).map(menuMsg);
}

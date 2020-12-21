import {Cmd, Dispatcher, noCmd, Sub, map, Maybe, nothing, Tuple, just} from "react-tea-cup";
import * as React from 'react';
import {item, ItemRenderer, Menu, menu, Model as TModel, Msg as TMsg, Pos, separator, ViewMenu} from 'tea-pop';
import * as TP from 'tea-pop';

export interface Model {
  readonly menuModel: Maybe<TModel<string>>;
  readonly lastClicked: Maybe<string>;
}

export type MenuModel = TModel<string>
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
  const model: Model = {
    menuModel: nothing,
    lastClicked: nothing,
  }
  return noCmd(model);
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
            onContextMenu={TP.stopEvent}
            onMouseDown={e => {
              dispatch({tag: 'mouse-down', button: e.button, pos: TP.pos(e.pageX, e.pageY)})
            }}
        >
          <div>
            {model.menuModel
                .map(() => "Menu is open")
                .withDefaultSupply(() =>
                  model.lastClicked
                      .map(lastClicked => "You selected '" + lastClicked + "'")
                      .withDefault("Right-click anywhere")
                )
            }
          </div>
        </div>
        {model.menuModel
            .map(menuModel =>
                <ViewMenu model={menuModel} dispatch={map(dispatch, menuMsg)} renderer={myRenderer}/>
            )
            .withDefault(<></>)
        }
      </>
  )
}

function updateMenu(model: Model, mac: [MenuModel, Cmd<MenuMsg>]): [Model, Cmd<Msg>] {
  return Tuple.fromNative(mac)
      .mapFirst(mm => ({...model, menuModel: just(mm)}))
      .mapSecond(mc => mc.map(menuMsg))
      .toNative();
}

export function update(msg: Msg, model: Model): [Model, Cmd<Msg>] {
  switch (msg.tag) {
    case "menu-msg": {
      if (model.menuModel.type === 'Nothing') {
        return noCmd(model);
      }
      const menuModel = model.menuModel.value;
      const mco = TP.update(msg.msg, menuModel);
      const newModel: Model = {
        ...model, menuModel: just(mco[0])
      };
      const cmd: Cmd<Msg> = mco[1].map(menuMsg);
      const mac: [Model, Cmd<Msg>] = [newModel, cmd];
      const outMsg: Maybe<TP.OutMsg<string>> = mco[2];
      return outMsg
          // eslint-disable-next-line array-callback-return
          .map(out => {
            switch (out.tag) {
              case "request-close":
                return closeMenu(model);
              case "item-selected":
                return closeMenu(model, just(out.data));
            }
          })
          .withDefault(mac);
    }
    case "mouse-down": {
      if (msg.button === 2) {
        return updateMenu(model, TP.open(myMenu, msg.pos));
      }
      return noCmd({
        ...model,
        menuModel: nothing,
        lastClicked: nothing
      });
    }
  }
}

function closeMenu(model: Model, lastClicked: Maybe<string> = nothing): [Model, Cmd<Msg>] {
  return noCmd({...model, menuModel: nothing, lastClicked })
}

export function subscriptions(model: Model): Sub<Msg> {
  return model.menuModel
      .map(mm => TP.subscriptions(mm).map(menuMsg))
      .withDefaultSupply(() => Sub.none());
}

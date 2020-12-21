import {Cmd, Dispatcher, noCmd, Sub, map, Maybe, nothing, Tuple, just, DocumentEvents} from "react-tea-cup";
import * as React from 'react';
import {item, ItemRenderer, Menu, menu, Model as TModel, Msg as TMsg, Pos, separator, ViewMenu} from 'tea-pop';
import * as TM from 'tea-pop';

export interface Model {
  // keep track of mouse position
  readonly mousePos: Pos;
  // ref to the tea-pop model
  readonly menuModel: Maybe<TModel<string>>;
  // keep last clicked item
  readonly lastClicked: Maybe<string>;
}

// just to avoid too much typing
export type MenuModel = TModel<string>
export type MenuMsg = TMsg<string>

/*
 * Msg
 */

export type Msg =
    | { tag: 'menu-msg', msg: MenuMsg }
    | { tag: 'mouse-down', button: number }
    | { tag: 'mouse-move', pos: Pos }
    | { tag: 'key-down', key: string }

function menuMsg(msg: MenuMsg): Msg {
  return {
    tag: "menu-msg",
    msg
  }
}

function onMouseDown(button: number): Msg {
  return {
    tag: "mouse-down", button
  }
}

function onMouseMove(pos: Pos): Msg {
  return {
    tag: "mouse-move", pos
  }
}

function onKeyDown(key: string): Msg {
  return {
    tag: "key-down", key
  }
}

/*
 * We keep our menus as constants. Those are, like everything, immutable.
 * They will serve as prototypes for when we open menus in reaction to clicks or
 * keystrokes...
 */

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
    mousePos: Pos.origin
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
              overflow: "auto",
            }}
            onContextMenu={TM.stopEvent}
        >
          <div style={{
            height: "100%", // to test scrolling set a fixed size that's larger than viewport
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div>
              {model.menuModel
                  .map(() => <span>Menu is open</span>)
                  .withDefaultSupply(() =>
                    model.lastClicked
                        .map(lastClicked => <span>You selected <em>{lastClicked}</em></span>)
                        .withDefault(<span>Right-click anywhere, or use context-menu key.</span>)
                  )
              }
            </div>
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
      const mco = TM.update(msg.msg, menuModel);
      const newModel: Model = {
        ...model, menuModel: just(mco[0])
      };
      const cmd: Cmd<Msg> = mco[1].map(menuMsg);
      const mac: [Model, Cmd<Msg>] = [newModel, cmd];
      const outMsg: Maybe<TM.OutMsg<string>> = mco[2];
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
    case "mouse-move": {
      return noCmd({...model, mousePos: msg.pos })
    }
    case "mouse-down": {
      if (msg.button === 2) {
        return updateMenu(model, TM.open(myMenu, model.mousePos));
      }
      return noCmd({
        ...model,
        menuModel: nothing,
        lastClicked: nothing
      });
    }
    case "key-down": {
      if (msg.key === 'ContextMenu') {
        return updateMenu(model, TM.open(myMenu, model.mousePos));
      }
      return noCmd(model);
    }
  }
}

function closeMenu(model: Model, lastClicked: Maybe<string> = nothing): [Model, Cmd<Msg>] {
  return noCmd({...model, menuModel: nothing, lastClicked })
}

const documentEvents = new DocumentEvents();

export function subscriptions(model: Model): Sub<Msg> {
  const menuSub: Sub<Msg> = model.menuModel
      .map(mm => TM.subscriptions(mm).map(menuMsg))
      .withDefaultSupply(() => Sub.none());
  const mouseDown: Sub<Msg> = documentEvents.on('mousedown', e => onMouseDown(e.button));
  const mouseMove: Sub<Msg> = documentEvents.on('mousemove', e => onMouseMove(TM.pos(e.pageX, e.pageY)));
  const keyDown: Sub<Msg> = documentEvents.on('keydown', e => onKeyDown(e.key));
  return Sub.batch([menuSub, mouseMove, mouseDown, keyDown]);
}

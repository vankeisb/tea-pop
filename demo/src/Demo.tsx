import {Cmd, Dispatcher, DocumentEvents, just, map, Maybe, noCmd, nothing, Sub, Tuple, Either, left, right} from "react-tea-cup";
import * as React from 'react';
import * as TM from 'tea-pop';
import {
  defaultItemRenderer,
  Dim,
  item,
  Menu,
  menu,
  Model as TModel,
  Msg as TMsg,
  place,
  Pos,
  separator,
  ViewMenu
} from 'tea-pop';
import { relative } from "path";

export interface Model {
  // keep track of mouse position
  readonly mousePos: Pos;
  // page to display
  readonly page: Either<MainPage, PlacementPage>;
}

interface MainPage {
  // ref to the tea-pop model
  readonly menuModel: Maybe<TModel<string>>;
  // keep last clicked item
  readonly lastClicked: Maybe<string>;
}

function initialMainPage(): MainPage {
  return {
    menuModel: nothing,
    lastClicked: nothing,
  }
}

interface PlacementPage {
  readonly refDim: Dim;
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
    | { tag: 'switch-page' }

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
 * We use strings for our data types, but it could hold a richer data type.
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

/**
 * We use the default item renderer with our item data type (string).
 */

const MyRenderer = defaultItemRenderer((s: string) => <span>{s}</span>);

/*
 * init, view, update, subs...
 */

export function init(): [Model, Cmd<Msg>] {
  return noCmd({
    mousePos: Pos.origin,
    page: left(initialMainPage()),
  });
}

export function view(dispatch: Dispatcher<Msg>, model: Model) {
  return model.page.match(
      mainPage => viewMainPage(dispatch, mainPage),
      placementPage => viewPlacementPage(dispatch, model, placementPage),
  )
}

function viewPlacementPage(dispatch: Dispatcher<Msg>, model: Model, page: PlacementPage) {
  // TODO call place func to get pos/dimensions of the menu
  // we need the viewport size for that...
  // const placed = place()
  return (
    <div className="demo">
        <div className="page-switch">
          <a href="#" onClick={() => dispatch({tag: "switch-page"})}>Close</a>
        </div>
        <div className="ref-elem" style={{
          border: "1px solid black",
          backgroundColor: "pink",
          height: 50,
          width: 50,
          position: "absolute",
          top: model.mousePos.y + 4,
          left: model.mousePos.x + 4,
        }}>
        </div>
        <div className="menu-elem" style={{
          border: "1px solid black",
          backgroundColor: "green",
          height: 300,
          width: 150,
          position: "absolute",
          top: model.mousePos.y + 4,
          left: model.mousePos.x + 4,
        }}>
        </div>
    </div>
  )
}

function viewMainPage(dispatch: Dispatcher<Msg>, page: MainPage) {
  return (
      <>
        <div
            className="demo"
            onContextMenu={TM.stopEvent}
            onMouseDown={e => dispatch(onMouseDown(e.button))}
        >
          <div className="page-switch">
            <a href="#" onClick={() => dispatch({tag: "switch-page"})}>Placement tests</a>
          </div>
          {page.menuModel
              .map(() => <span>Menu is open</span>)
              .withDefaultSupply(() =>
                page.lastClicked
                    .map(lastClicked => <span>You selected <em>{lastClicked}</em></span>)
                    .withDefaultSupply(() =>
                      <>
                        <div>Right-click anywhere, or use the <code>≣</code> key.</div>
                      </>
                    )
              )
          }
        </div>
        {/* include the Menu if it's open */}
        {page.menuModel
            .map(menuModel =>
                <ViewMenu model={menuModel} dispatch={map(dispatch, menuMsg)} renderer={MyRenderer}/>
            )
            .withDefault(<></>)
        }
      </>
  )
}

export function update(msg: Msg, model: Model): [Model, Cmd<Msg>] {
  switch (msg.tag) {
    case "menu-msg": {
      return model.page.match(
          mainPage => {
            // got child msg, update our child...
            if (mainPage.menuModel.type === 'Nothing') {
              return noCmd(model);
            }
            const menuModel = mainPage.menuModel.value;
            const mco = TM.update(msg.msg, menuModel);
            const newPage: MainPage = {
              ...mainPage,
              menuModel: just(mco[0])
            };
            const newModel: Model = {
              ...model, page: left(newPage)
            };
            const cmd: Cmd<Msg> = mco[1].map(menuMsg);
            const mac: [Model, Cmd<Msg>] = [newModel, cmd];
            // and handle its out msg if needed
            const outMsg: Maybe<TM.OutMsg<string>> = mco[2];
            return outMsg
                // eslint-disable-next-line array-callback-return
                .map(out => {
                  switch (out.tag) {
                    case "request-close": {
                      const mac2 = closeMenu(newModel);
                      return Tuple.fromNative(mac2).mapSecond(c => Cmd.batch([cmd, c])).toNative();
                    }
                    case "item-selected": {
                      const mac2 = closeMenu(newModel, just(out.data));
                      return Tuple.fromNative(mac2).mapSecond(c => Cmd.batch([cmd, c])).toNative();
                    }
                  }
                })
                .withDefault(mac);
          },
          placementPage => noCmd(model)
      )}
    case "mouse-move": {
      // keep track of the mouse pos (needed for opening with keyboard)
      return noCmd({...model, mousePos: msg.pos })
    }
    case "mouse-down": {
      // open menu on right click
      if (msg.button === 2) {
        return updateMenu(model, TM.open(myMenu, model.mousePos));
      }
      return noCmd(model);
    }
    case "key-down": {
      // open menu on context menu key
      if (msg.key === 'ContextMenu') {
        return updateMenu(model, TM.open(myMenu, model.mousePos));
      }
      return noCmd(model);
    }
    case "switch-page": {
      return noCmd(
        model.page.match(
          () => {
            return {
              ...model,
              page: right({
                refDim: Dim.zero
              })
            }
          },
          () => {
            return {
              ...model,
              page: left(initialMainPage())
            }
          }
        )
      )
    }
  }
}

const documentEvents = new DocumentEvents();

export function subscriptions(model: Model): Sub<Msg> {
  // the menu's subs
  const menuSub: Sub<Msg> = model.page.match(
      mainPage => mainPage.menuModel
          .map(mm => TM.subscriptions(mm).map(menuMsg))
          .withDefaultSupply(() => Sub.none()),
      () => Sub.none()
  );

  // mouse & key subs
  const mouseMove: Sub<Msg> = documentEvents.on('mousemove', e => onMouseMove(TM.pos(e.pageX, e.pageY)));
  const keyDown: Sub<Msg> = documentEvents.on('keydown', e => onKeyDown(e.key));
  return Sub.batch([menuSub, mouseMove, keyDown]);
}

/*
 * Helper functions
 */

function updateMenu(model: Model, mac: [MenuModel, Cmd<MenuMsg>]): [Model, Cmd<Msg>] {
  return model.page.match(
    mainPage => Tuple.fromNative(mac)
      .mapFirst(mm => {
        const newModel: Model = {
          ...model,
          page: left({
            ...mainPage,
            menuModel: just(mm)
          })
        }
        return newModel;
      // } ({...model, page: left({ ...mainPage, menuModel: just(mm)}})))
      })
      .mapSecond(mc => mc.map(menuMsg))
      .toNative(),
    () => noCmd(model)
  )
}

function closeMenu(model: Model, lastClicked: Maybe<string> = nothing): [Model, Cmd<Msg>] {
  const newModel: Model = {
    ...model,
    page: model.page.mapLeft(mainPage => ({
      ...mainPage,
      menuModel: nothing,
      lastClicked
    }))
  }
  return noCmd(newModel)
}


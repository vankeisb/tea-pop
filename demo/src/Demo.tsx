import {
  Cmd,
  Dispatcher,
  DocumentEvents,
  Either,
  just,
  left,
  map,
  Maybe,
  noCmd,
  nothing,
  right,
  Sub, Task,
  Tuple, WindowEvents
} from "react-tea-cup";
import * as React from 'react';
import * as TM from 'tea-pop';
import {
  defaultItemRenderer, dim,
  Dim,
  item,
  Menu,
  menu,
  Model as TModel,
  Msg as TMsg, pos, box,
  Pos,
  separator,
  ViewMenu, place
} from 'tea-pop';
import {Box} from "tea-pop/dist/Box";

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
  readonly viewportDim: Maybe<Dim>;
  readonly refDim: Dim;
}

function openPlacementPage(model: Model): [Model, Cmd<Msg>] {
  return Tuple.t2n(
      {
        ...model,
        page: right({
          viewportDim: nothing,
          refDim: dim(30),
        })
      },
      Task.perform(
          Task.succeedLazy(() => dim(window.innerWidth, window.innerHeight)),
          gotWindowDimensions
      )
  )
}

// just to avoid too much typing
export type MenuModel = TModel<string>
export type MenuMsg = TMsg<string>

/*
 * Msg
 */

export type Msg =
    | { tag: 'switch-page' }
    | { tag: 'got-window-dimensions', d: Dim }
    | { tag: 'main-page-msg', m: MainPageMsg }
    | { tag: 'mouse-move', pos: Pos }
    | { tag: 'placement-page-msg' }


type MainPageMsg =
    | { tag: 'menu-msg', msg: MenuMsg }
    | { tag: 'mouse-down', button: number }
    | { tag: 'key-down', key: string }

function mainPageMsg(m: MainPageMsg): Msg {
  return {
    tag: "main-page-msg",
    m
  }
}

function gotWindowDimensions(d: Dim): Msg {
  return {
    tag: "got-window-dimensions",
    d
  }
}

function menuMsg(msg: MenuMsg): MainPageMsg {
  return {
    tag: "menu-msg",
    msg
  }
}

function onMouseDown(button: number): Msg {
  return mainPageMsg({
    tag: "mouse-down", button
  })
}

function onMouseMove(pos: Pos): Msg {
  return{
    tag: "mouse-move", pos
  }
}

function onKeyDown(key: string): Msg {
  return mainPageMsg({
    tag: "key-down", key
  })
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
  const { viewportDim, refDim } = page;
  return viewportDim.map(vd => {
    const { mousePos } = model;
    const elemDim = dim(123);
    const placedBox: Box = place(vd, box(pos(mousePos.x, mousePos.y), refDim), elemDim);
    const viewDim = (d: Dim) => <span>{d.w}*{d.h}</span>
    const viewPos = (p: Pos) => <span>{p.x}:{p.y}</span>
    return (
        <div className="demo">
          <div className="page-switch">
            <a href="#" onClick={() => dispatch({tag: "switch-page"})}>Close</a>
          </div>
          <div className="dimensions">
            <ul>
              <li>elem: {viewDim(elemDim)}</li>
              <li>viewport: {viewDim(vd)}</li>
              <li>ref: {viewDim(refDim)}</li>
              <li>mousePos: {viewPos(mousePos)}</li>
              <li>placed: {viewPos(placedBox.p)}, {viewDim(placedBox.d)}</li>
            </ul>
          </div>
          <div className="ref-elem" style={{
            height: refDim.h,
            width: refDim.w,
            left: model.mousePos.x + 2,
            top: model.mousePos.y + 2,
          }}>
          </div>
          <div className="menu-elem" style={{
            height: placedBox.d.h,
            width: placedBox.d.w,
            left: placedBox.p.x,
            top: placedBox.p.y,
          }}>
          </div>
        </div>
    )
  }).withDefaultSupply(() => <></>);
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
        {page.menuModel
            .map(menuModel =>
                <ViewMenu model={menuModel} dispatch={map(dispatch, m => mainPageMsg(menuMsg(m)))} renderer={MyRenderer}/>
            )
            .withDefault(<></>)
        }
      </>
  )
}

export function update(msg: Msg, model: Model): [Model, Cmd<Msg>] {
  switch (msg.tag) {
    case "main-page-msg": {
      const mpMsg: MainPageMsg = msg.m;
      switch (mpMsg.tag)  {
        case "menu-msg": {
          return model.page.match(
              mainPage => {
                // got child msg, update our child...
                if (mainPage.menuModel.type === 'Nothing') {
                  return noCmd(model);
                }
                const menuModel = mainPage.menuModel.value;
                const mco = TM.update(mpMsg.msg, menuModel);
                const newPage: MainPage = {
                  ...mainPage,
                  menuModel: just(mco[0])
                };
                const newModel: Model = {
                  ...model, page: left(newPage)
                };
                const cmd: Cmd<Msg> = mco[1].map(menuMsg).map(mainPageMsg);
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
          )
        }
        case "mouse-down": {
          // open menu on right click
          if (mpMsg.button === 2) {
            return updateMenu(model, TM.open(myMenu, model.mousePos));
          }
          return noCmd(model);
        }
        case "key-down": {
          // open menu on context menu key
          if (mpMsg.key === 'ContextMenu') {
            return updateMenu(model, TM.open(myMenu, model.mousePos));
          }
          return noCmd(model);
        }
      }
      break;
    }
    case "mouse-move": {
      // keep track of the mouse pos (needed for opening with keyboard)
      return noCmd({...model, mousePos: msg.pos})
    }
    case "placement-page-msg": {
      return noCmd(model);
    }
    case "switch-page": {
      return model.page.match(
          () => openPlacementPage(model),
          () => noCmd({
            ...model,
            page: left(initialMainPage())
          })
      )
    }
    case "got-window-dimensions": {
      return noCmd({
        ...model,
        page: model.page.mapRight(placementPage => ({...placementPage, viewportDim: just(msg.d) }))
      });
    }
  }
}

const documentEvents = new DocumentEvents();
const windowEvents = new WindowEvents();

export function subscriptions(model: Model): Sub<Msg> {
  const mouseMove: Sub<Msg> = documentEvents.on('mousemove', e => onMouseMove(pos(e.pageX, e.pageY)));
  return model.page.match(
      mainPage => {
        // the menu's subs
        const menuSub: Sub<Msg> = mainPage.menuModel
                .map(mm => TM.subscriptions(mm).map(menuMsg).map(mainPageMsg))
                .withDefaultSupply(() => Sub.none());
        // mouse & key subs
        const keyDown: Sub<Msg> = documentEvents.on('keydown', e => onKeyDown(e.key));
        return Sub.batch([menuSub, mouseMove, keyDown]);
      },
      () => Sub.batch([
          mouseMove,
        windowEvents.on('resize', e => gotWindowDimensions(dim(window.innerWidth, window.innerHeight)))
      ])
  )
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
          .mapSecond(mc => mc.map(menuMsg).map(mainPageMsg))
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


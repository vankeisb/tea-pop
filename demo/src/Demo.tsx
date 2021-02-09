import {
  Cmd,
  Dispatcher,
  DocumentEvents,
  just,
  map,
  Maybe,
  noCmd,
  nothing,
  Sub,
  Task,
  Tuple,
  WindowEvents
} from "react-tea-cup";
import * as React from 'react';
import {
  box,
  defaultItemRenderer,
  dim,
  Dim,
  item,
  Menu,
  menu,
  place,
  placeCombo,
  pos,
  Pos,
  separator,
  ViewMenu,
  Box,
  MenuModel,
  MenuMsg,
  getWindowDimensions,
  stopEvent,
  menuUpdate,
  MenuOutMsg,
  menuSubscriptions,
  menuOpen,
  DropDownModel,
  ViewDropDown,
  dropDownOpen,
  DropDownMsg,
  dropDownUpdate, dropDownSubscriptions,
  DropDownRequestClose,
} from 'tea-pop';

export interface Model {
  // keep track of mouse position
  readonly mousePos: Pos;
  // page to display
  readonly page: Page;
}

type Page = MainPage | PlacementPage | DropDownPage

interface MainPage {
  readonly tag: 'main-page';
  // ref to the tea-pop model
  readonly menuModel: Maybe<MyMenuModel>;
  // keep last clicked item
  readonly lastClicked: Maybe<string>;
}

function initialMainPage(): MainPage {
  return {
    tag: "main-page",
    menuModel: nothing,
    lastClicked: nothing,
  }
}

function openMainPage(model: Model): [Model, Cmd<Msg>] {
  return noCmd({...model, page: initialMainPage()});
}

type PlacementMode = "menu" | "drop-down";

interface PlacementPage {
  readonly tag: 'placement-page';
  readonly mode: PlacementMode;
  readonly viewportDim: Maybe<Dim>;
}

function openPlacementPage(model: Model): [Model, Cmd<Msg>] {
  return Tuple.t2n(
      {
        ...model,
        page: {
          tag: "placement-page",
          viewportDim: nothing,
          refDim: dim(100),
          mode: "menu",
        }
      },
      Task.perform(
          Task.succeedLazy(() => dim(window.innerWidth, window.innerHeight)),
          gotWindowDimensions
      )
  )
}

interface DropDownPage {
  readonly tag: "drop-down-page";
  readonly viewportDim: Maybe<Dim>;
  readonly indexAndModel: Maybe<Tuple<number,DropDownModel>>;
}

function openDropDownPage(model: Model): [Model, Cmd<Msg>] {
  return Tuple.t2n({
    ...model,
    page: {
      tag: "drop-down-page",
      viewportDim: nothing,
      indexAndModel: nothing,
    }
  }, Task.perform(getWindowDimensions, gotWindowDimensions))
}

// just to avoid too much typing
export type MyMenuModel = MenuModel<string>
export type MyMenuMsg = MenuMsg<string>

/*
 * Msg
 */

type PageTag = "main-page" | "placement-page" | "drop-down-page";

export type Msg =
    | { tag: 'switch-page', page: PageTag }
    | { tag: 'got-window-dimensions', d: Dim }
    | { tag: 'main-page-msg', m: MainPageMsg }
    | { tag: 'dd-page-msg', m: DropDownPageMsg }
    | { tag: 'mouse-move', pos: Pos }
    | { tag: 'key-down', key: string }

type DropDownPageMsg =
    | { tag: "button-clicked", index: number; b: Box }
    | { tag: "dd-msg", m: DropDownMsg }

function dropDownPageMsg(m: DropDownPageMsg): Msg {
  return {
    tag: "dd-page-msg",
    m
  }
}

type MainPageMsg =
    | { tag: 'menu-msg', msg: MyMenuMsg }
    | { tag: 'mouse-down', button: number }

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

function menuMsg(msg: MyMenuMsg): MainPageMsg {
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
  return {
    tag: "mouse-move", pos
  }
}

function onKeyDown(key: string): Msg {
  return {
    tag: "key-down", key
  }
}

function switchPage(p: PageTag): Msg {
  return {
    tag: "switch-page",
    page: p,
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
    page: initialMainPage(),
  });
}

export function view(dispatch: Dispatcher<Msg>, model: Model) {
  switch (model.page.tag) {
    case "main-page": {
      return viewMainPage(dispatch, model.page);
    }
    case "placement-page": {
      return viewPlacementPage(dispatch, model, model.page);
    }
    case "drop-down-page": {
      return viewDropDownPage(dispatch, model.page);
    }
  }
}


function viewPlacementPage(dispatch: Dispatcher<Msg>, model: Model, page: PlacementPage) {
  const {viewportDim} = page;
  return viewportDim.map(vd => {
    let placeFct = page.mode === "menu" ? place : placeCombo
    const {mousePos} = model;
    const elemDim = dim(600, 400);
    const refDim = dim(100, 50);
    const placedBox: Box = placeFct(vd, box(pos(mousePos.x, mousePos.y), refDim), elemDim);
    const viewDim = (d: Dim) => <span>{d.w}*{d.h}</span>
    const viewPos = (p: Pos) => <span>{p.x}:{p.y}</span>
    return (
        <div className="demo">
          <div className="dimensions">
            <h1>Placement tests (<code>x</code> to close)</h1>
            <ul>
              <li>mode: {page.mode} (toggle with <code>M</code>)</li>
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
            left: model.mousePos.x,
            top: model.mousePos.y,
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
            onContextMenu={stopEvent}
            onMouseDown={e => dispatch(onMouseDown(e.button))}
        >
          <div className="page-switch">
            { /* eslint-disable-next-line */}
            <a href="#" onClick={() => dispatch(switchPage("drop-down-page"))}>Drop-down</a>
            {" "}|{" "}
            { /* eslint-disable-next-line */}
            <a href="#" onClick={() => dispatch(switchPage("placement-page"))}>Placement tests</a>
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
                <ViewMenu model={menuModel} dispatch={map(dispatch, m => mainPageMsg(menuMsg(m)))}
                          renderer={MyRenderer}/>
            )
            .withDefault(<></>)
        }
      </>
  )
}

function viewDropDownPage(dispatch: Dispatcher<Msg>, page: DropDownPage) {
  const steps = 10;
  const padding = 4;
  return page.viewportDim
      .map(viewportDim => {
        const xStep = Math.floor(viewportDim.w / steps);
        const yStep = Math.floor(viewportDim.h / steps);
        const buttons = [];
        let btnIndex = 1;
        const height = yStep - (padding * 2);
        const width = xStep - (padding * 2);
        for (let x = 0; (x + padding + width) < viewportDim.w; x += xStep) {
          for (let y = 0; (y + padding + height) < viewportDim.h; y += yStep) {
            const curBtnIndex = btnIndex;
            const top = y + padding;
            const left = x + padding;
            const backgroundColor = page.indexAndModel
                .map(iam => iam.a)
                .filter(i => i === curBtnIndex).map(() => "lightblue").withDefault("lightgray");
            buttons.push(
                <button
                    key={"btn" + btnIndex}
                    style={{
                      position: "absolute",
                      top,
                      left,
                      height,
                      width,
                      border: "none",
                      backgroundColor,
                    }}
                    onClick={(evt) => dispatch(dropDownPageMsg({
                      tag: "button-clicked",
                      index: curBtnIndex,
                      b: Box.fromDomRect((evt.target as HTMLElement).getBoundingClientRect())
                    }))}
                >
                  {btnIndex}
                </button>
            )
            btnIndex++;
          }
        }
        return (
            <>
              <div className="drop-down-page">
                {buttons}
              </div>
              {page.indexAndModel
                  .map(ddModel =>
                      <ViewDropDown renderer={() => <div className="my-drop-down">HELLO</div>} model={ddModel.b}/>
                  )
                  .withDefaultSupply(() => <></>)
              }
            </>
        )
      })
      .withDefaultSupply(() => <></>)
}

export function update(msg: Msg, model: Model): [Model, Cmd<Msg>] {
  switch (msg.tag) {
    case "main-page-msg": {
      if (model.page.tag !== "main-page") {
        return noCmd(model);
      }
      const mpMsg: MainPageMsg = msg.m;
      const mainPage: MainPage = model.page;
      switch (mpMsg.tag) {
        case "menu-msg": {
          // got child msg, update our child...
          if (mainPage.menuModel.type === 'Nothing') {
            return noCmd(model);
          }
          const menuModel = mainPage.menuModel.value;
          const mco = menuUpdate(mpMsg.msg, menuModel);
          const newPage: MainPage = {
            ...mainPage,
            menuModel: just(mco[0])
          };
          const newModel: Model = {
            ...model, page: newPage
          };
          const cmd: Cmd<Msg> = mco[1].map(menuMsg).map(mainPageMsg);
          const mac: [Model, Cmd<Msg>] = [newModel, cmd];
          // and handle its out msg if needed
          const outMsg: Maybe<MenuOutMsg<string>> = mco[2];
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
        }
        case "mouse-down": {
          // open menu on right click
          if (mpMsg.button === 2) {
            return updateMenu(model, menuOpen(myMenu, box(model.mousePos, Dim.zero)));
          }
          return noCmd(model);
        }
      }
      break;
    }
    case "key-down": {
      switch (model.page.tag) {
        case "main-page": {
          // open menu on context menu key
          if (msg.key === 'ContextMenu') {
            return updateMenu(model, menuOpen(myMenu, box(model.mousePos, Dim.zero)));
          }
          return noCmd(model);
        }
        case "placement-page": {
          const placementPage = model.page;
          // close placement test on ESC
          switch (msg.key) {
            case 'x': {
              return noCmd({
                ...model,
                page: initialMainPage()
              })
            }
            case 'm': {
              return noCmd({
                ...model,
                page: {
                  ...placementPage,
                  mode: placementPage.mode === "menu" ? "drop-down" : "menu"
                }
              })
            }
            default:
              return noCmd(model);
          }
        }
        case "drop-down-page": {
          switch (msg.key) {
            case 'x': {
              return noCmd({
                ...model,
                page: initialMainPage()
              })
            }
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
    case "switch-page": {
      switch (msg.page) {
        case "main-page": {
          return openMainPage(model);
        }
        case "drop-down-page": {
          return openDropDownPage(model);
        }
        case "placement-page": {
          return openPlacementPage(model);
        }
      }
      break;
    }
    case "got-window-dimensions": {
      if (model.page.tag === "placement-page" || model.page.tag === "drop-down-page") {
        const page = model.page;
        return noCmd({
          ...model,
          page: {...page, viewportDim: just(msg.d)}
        })
      }
      return noCmd(model);
    }
    case "dd-page-msg": {
      if (model.page.tag !== "drop-down-page") {
        return noCmd(model);
      }
      const { page } = model;
      const pageMsg = msg.m;
      switch (pageMsg.tag) {
        case "button-clicked": {
          const ddMac: [DropDownModel, Cmd<DropDownMsg>] = dropDownOpen(Task.succeed(pageMsg.b));
          return Tuple.fromNative(ddMac)
              .mapFirst(ddModel => ({
                ...model,
                page: {
                  ...page,
                  indexAndModel: just(new Tuple(pageMsg.index, ddModel))
                }
              }))
              .mapSecond(c => c.map(m => dropDownPageMsg({ tag: "dd-msg", m})))
              .toNative();
        }
        case "dd-msg": {
          return model.page.indexAndModel
              .map(iam => {
                const ddMac: [DropDownModel, Cmd<DropDownMsg>, DropDownRequestClose] = dropDownUpdate(pageMsg.m, iam.b);
                if (ddMac[2]) {
                  // close requested
                  const newModel: Model = {
                    ...model,
                    page: {
                      ...page,
                      indexAndModel: nothing,
                    }
                  };
                  return noCmd<Model, Msg>(newModel);
                //   return noCmd({
                //     ...model,
                //     page: {
                //       ...page,
                //       indexAndModel: nothing,
                //     }
                //   });
                }
                const res: [Model, Cmd<Msg>] = Tuple.fromNative([ddMac[0], ddMac[1]])
                    .mapFirst(ddModel => ({
                      ...model,
                      page: {
                        ...page,
                        indexAndModel: page.indexAndModel.map(t => new Tuple(t.a, ddModel))
                      }
                    }))
                    .mapSecond(c => c.map(m => dropDownPageMsg({ tag: "dd-msg", m})))
                    .toNative();
                return res;
              })
              .withDefaultSupply(() => noCmd(model));
        }
      }
    }
  }
}

const documentEvents = new DocumentEvents();
const windowEvents = new WindowEvents();

export function subscriptions(model: Model): Sub<Msg> {
  const mouseMove: Sub<Msg> = documentEvents.on('mousemove', e => onMouseMove(pos(e.pageX, e.pageY)));
  const keyDown: Sub<Msg> = documentEvents.on('keydown', e => onKeyDown(e.key));
  switch (model.page.tag) {
    case "main-page": {
      const mainPage = model.page;
      // the menu's subs
      const menuSub: Sub<Msg> = mainPage.menuModel
          .map(mm => menuSubscriptions(mm).map(menuMsg).map(mainPageMsg))
          .withDefaultSupply(() => Sub.none());
      // mouse & key subs
      return Sub.batch([menuSub, mouseMove, keyDown]);
    }
    case "placement-page": {
      return Sub.batch([
        mouseMove,
        keyDown,
        windowEvents.on('resize', e => gotWindowDimensions(dim(window.innerWidth, window.innerHeight)))
      ])
    }
    case "drop-down-page": {
      return Sub.batch([
        dropDownSubscriptions().map(m => dropDownPageMsg({ tag: "dd-msg", m })),
        keyDown,
        windowEvents.on('resize', e => gotWindowDimensions(dim(window.innerWidth, window.innerHeight)))
      ]);
    }
  }
}

/*
 * Helper functions
 */

function updateMenu(model: Model, mac: [MyMenuModel, Cmd<MyMenuMsg>]): [Model, Cmd<Msg>] {
  if (model.page.tag !== "main-page") {
    return noCmd(model);
  }
  const mainPage = model.page;
  return Tuple.fromNative(mac)
      .mapFirst(mm => {
        const newModel: Model = {
          ...model,
          page: {
            ...mainPage,
            menuModel: just(mm)
          }
        }
        return newModel;
        // } ({...model, page: left({ ...mainPage, menuModel: just(mm)}})))
      })
      .mapSecond(mc => mc.map(menuMsg).map(mainPageMsg))
      .toNative();
}

function closeMenu(model: Model, lastClicked: Maybe<string> = nothing): [Model, Cmd<Msg>] {
  if (model.page.tag !== "main-page") {
    return noCmd(model);
  }
  const mainPage = model.page;
  const newModel: Model = {
    ...model,
    page: {
      ...mainPage,
      menuModel: nothing,
      lastClicked
    }
  }
  return noCmd(newModel)
}


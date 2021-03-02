import {MenuPage, myMenu, MyMenuModel} from "./MenuPage";
import {menuMsg, MenuPageMsg, MyMenuMsg, onKeyDown, onMouseMove} from "./MenuPageMsg";
import {Cmd, DocumentEvents, just, Maybe, noCmd, nothing, Sub, Tuple, WindowEvents} from "react-tea-cup";
import {
  open as menuOpen,
  OutMsg as MenuOutMsg,
  subscriptions as menuSubscriptions,
  update as menuUpdate
} from "tea-pop-menu";
import {box, Dim, pos, Pos} from "tea-pop-core";


export function menuPageInit(): [MenuPage, Cmd<MenuPageMsg>] {
  return noCmd({
    tag: "menu",
    mousePos: Pos.origin,
    lastClicked: nothing,
    menuModel: nothing,
  })
}

export function menuPageUpdate(msg: MenuPageMsg, menuPage: MenuPage): [MenuPage, Cmd<MenuPageMsg>] {
  switch (msg.tag) {
    case "menu-msg": {
      console.log("menu-msg", msg.msg);
      return menuPage.menuModel
          .map(menuModel => {
            const mco = menuUpdate(msg.msg, menuModel);
            const newMenuPage: MenuPage = {
              ...menuPage,
              menuModel: just(mco[0])
            };
            const cmd: Cmd<MenuPageMsg> = mco[1].map(menuMsg);
            const outMsg: Maybe<MenuOutMsg<string>> = mco[2];
            return outMsg
                // eslint-disable-next-line array-callback-return
                .map(out => {
                  switch (out.tag) {
                    case "request-close": {
                      const mac2 = closeMenu(newMenuPage);
                      return Tuple.fromNative(mac2).mapSecond(c => Cmd.batch([cmd, c])).toNative();
                    }
                    case "item-selected": {
                      const mac2 = closeMenu(newMenuPage, just(out.data));
                      return Tuple.fromNative(mac2).mapSecond(c => Cmd.batch([cmd, c])).toNative();
                    }
                  }
                })
                .withDefaultSupply(() => Tuple.t2n(newMenuPage, cmd));
          })
          .withDefaultSupply(() => noCmd(menuPage));
    }
    case "mouse-down": {
      console.log("down", menuPage.mousePos);
      // open menu on right click
      if (msg.button === 2) {
        return updateMenu(menuPage, menuOpen(myMenu, box(menuPage.mousePos, Dim.zero)));
      }
      return noCmd(menuPage);
    }
    case "mouse-move": {
      console.log("move", msg.pos);
      return noCmd({...menuPage, mousePos: msg.pos });
    }
    case "key-down": {
      // open menu on context menu key
      if (msg.key === 'ContextMenu') {
        return updateMenu(menuPage, menuOpen(myMenu, box(menuPage.mousePos, Dim.zero)));
      }
      return noCmd(menuPage);
    }
  }
}

const documentEvents = new DocumentEvents();
const windowEvents = new WindowEvents();

export function menuPageSubs(page: MenuPage): Sub<MenuPageMsg> {
  // the menu's subs
  const menuSub: Sub<MenuPageMsg> = page.menuModel
      .map(mm => menuSubscriptions(mm).map(menuMsg))
      .withDefaultSupply(() => Sub.none());
  // mouse & key subs
  const mouseMove: Sub<MenuPageMsg> = documentEvents.on('mousemove', e => onMouseMove(pos(e.pageX, e.pageY)));
  const keyDown: Sub<MenuPageMsg> = documentEvents.on('keydown', e => onKeyDown(e.key));

  return Sub.batch([menuSub, mouseMove, keyDown]);
}

function updateMenu(page: MenuPage, mac: [MyMenuModel, Cmd<MyMenuMsg>]): [MenuPage, Cmd<MenuPageMsg>] {
  return Tuple.fromNative(mac)
      .mapFirst(mm => {
        const newPage: MenuPage = {
          ...page,
          menuModel: just(mm)
        }
        return newPage;
        // } ({...model, page: left({ ...mainPage, menuModel: just(mm)}})))
      })
      .mapSecond(mc => mc.map(menuMsg))
      .toNative();
}

function closeMenu(menuPage: MenuPage, lastClicked: Maybe<string> = nothing): [MenuPage, Cmd<MenuPageMsg>] {
  return noCmd({
    ...menuPage,
    menuModel: nothing,
    lastClicked
  })
}


import * as React from "react";
import { Cmd, Dispatcher, map, noCmd, Sub, Task, Tuple } from "tea-cup-fp";
import { homeModel, Model, Page } from "./Model";
import {
  comboPageMsg,
  dropDownPageMsg,
  menuPageMsg,
  Msg,
  navigate,
  noop,
  placementPageMsg,
} from "./Msg";
import { Route, router, routeToUrl } from "./routes";
import { viewMenuPage } from "./menu-page/ViewMenuPage";
import { menuPageInit, menuPageSubs, menuPageUpdate } from "./menu-page/Update";

import "./App.scss";
import { viewDropDownPage } from "./dropdown-page/ViewDropDownPage";
import {
  dropDownPageInit,
  dropDownPageSubs,
  dropDownPageUpdate,
} from "./dropdown-page/Update";
import {
  placementPageInit,
  placementPageSubs,
  placementPageUpdate,
} from "./placement-page/Update";
import { viewPlacementPage } from "./placement-page/ViewPlacementPage";
import { DevTools, newUrl, ProgramWithNav } from "react-tea-cup";
import {
  comboPageInit,
  comboPageSubs,
  comboPageUpdate,
} from "./combo-page/Update";
import { viewComboPage } from "./combo-page/ViewComboPage";

function init(l: Location): [Model, Cmd<Msg>] {
  return (
    router
      .parseLocation(l)
      // eslint-disable-next-line array-callback-return
      .map((route) => {
        switch (route) {
          case "home": {
            return initHome();
          }
          case "menu": {
            return Tuple.fromNative(menuPageInit())
              .mapFirst((page) => ({
                page,
              }))
              .mapSecond((c) => c.map(menuPageMsg))
              .toNative();
          }
          case "dropdown": {
            return Tuple.fromNative(dropDownPageInit())
              .mapFirst((page) => ({
                page,
              }))
              .mapSecond((c) => c.map(dropDownPageMsg))
              .toNative();
          }
          case "placement": {
            return Tuple.fromNative(placementPageInit())
              .mapFirst((page) => ({
                page,
              }))
              .mapSecond((c) => c.map(placementPageMsg))
              .toNative();
          }
          case "combo": {
            return Tuple.fromNative(comboPageInit())
              .mapFirst((page) => ({
                page,
              }))
              .mapSecond((c) => c.map(comboPageMsg))
              .toNative();
          }
        }
      })
      .withDefaultSupply(() => initHome())
  );
}

function initHome(): [Model, Cmd<Msg>] {
  return noCmd(homeModel());
}

function link(dispatch: Dispatcher<Msg>, route: Route, text: string) {
  return (
    <a
      href={"#"}
      onClick={(e) => {
        e.preventDefault();
        dispatch(navigate(route));
      }}
    >
      {text}
    </a>
  );
}

function view(dispatch: Dispatcher<Msg>, model: Model): React.ReactNode {
  const { page } = model;
  switch (page.tag) {
    case "home": {
      return (
        <>
          <h1>tea-pop demo app</h1>
          <ul>
            <li>{link(dispatch, "menu", "Context menu")}</li>
            <li>{link(dispatch, "dropdown", "Drop-down")}</li>
            <li>{link(dispatch, "combo", "Combobox")}</li>
            <li>{link(dispatch, "placement", "Live placement")}</li>
          </ul>
        </>
      );
    }
    case "menu": {
      return viewMenuPage(map(dispatch, menuPageMsg), page);
    }
    case "drop-down-page": {
      return viewDropDownPage(map(dispatch, dropDownPageMsg), page);
    }
    case "placement-page": {
      return viewPlacementPage(map(dispatch, placementPageMsg), page);
    }
    case "combo-page": {
      return viewComboPage(map(dispatch, comboPageMsg), page);
    }
  }
}

function updatePage<P extends Page, M>(
  msg: M,
  page: P,
  updateF: (m: M, p: P) => [P, Cmd<M>],
  liftF: (m: M) => Msg
): [Model, Cmd<Msg>] {
  const mac: [P, Cmd<M>] = updateF(msg, page);
  const newModel: Model = { page: mac[0] };
  const cmd: Cmd<Msg> = mac[1].map(liftF);
  return Tuple.t2n(newModel, cmd);
}

function update(msg: Msg, model: Model): [Model, Cmd<Msg>] {
  switch (msg.tag) {
    case "url-change": {
      return init(msg.l);
    }
    case "menu-page-msg": {
      const { page } = model;
      if (page.tag !== "menu") {
        return noCmd(model);
      }
      return updatePage(msg.msg, page, menuPageUpdate, menuPageMsg);
    }
    case "dd-page-msg": {
      const { page } = model;
      if (page.tag !== "drop-down-page") {
        return noCmd(model);
      }
      return updatePage(msg.msg, page, dropDownPageUpdate, dropDownPageMsg);
    }
    case "placement-page-msg": {
      const { page } = model;
      if (page.tag !== "placement-page") {
        return noCmd(model);
      }
      return updatePage(msg.msg, page, placementPageUpdate, placementPageMsg);
    }
    case "combo-page-msg": {
      const { page } = model;
      if (page.tag !== "combo-page") {
        return noCmd(model);
      }
      return updatePage(msg.msg, page, comboPageUpdate, comboPageMsg);
    }
    case "navigate": {
      return Tuple.t2n(
        model,
        Task.perform(newUrl(routeToUrl(msg.route)), () => noop)
      );
    }
    case "noop": {
      return noCmd(model);
    }
  }
}

function subscriptions(model: Model): Sub<Msg> {
  const { page } = model;
  switch (page.tag) {
    case "menu": {
      return menuPageSubs(page).map(menuPageMsg);
    }
    case "drop-down-page": {
      return dropDownPageSubs().map(dropDownPageMsg);
    }
    case "placement-page": {
      return placementPageSubs().map(placementPageMsg);
    }
    case "combo-page": {
      return comboPageSubs(page).map(comboPageMsg);
    }
    default: {
      return Sub.none();
    }
  }
}

export function onUrlChange(l: Location): Msg {
  return {
    tag: "url-change",
    l,
  };
}

const devTools = new DevTools<Model, Msg>().setVerbose(true).asGlobal();

export const DemoApp = () => (
  <ProgramWithNav
    onUrlChange={onUrlChange}
    init={init}
    view={view}
    update={update}
    subscriptions={subscriptions}
    {...devTools.getProgramProps()}
  />
);

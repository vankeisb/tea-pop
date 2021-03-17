import * as React from "react";
import {Cmd, DevTools, Dispatcher, map, newUrl, noCmd, ProgramWithNav, Sub, Task, Tuple} from "react-tea-cup";
import {homeModel, Model} from "./Model";
import {dropDownPageMsg, menuPageMsg, Msg, navigate, noop, placementPageMsg, tooltipPageMsg} from "./Msg";
import {Route, router, routeToUrl} from "./routes";
import {viewMenuPage} from "./menu-page/ViewMenuPage";
import {menuPageInit, menuPageSubs, menuPageUpdate} from "./menu-page/Update";

import './App.scss';
import {viewDropDownPage} from "./dropdown-page/ViewDropDownPage";
import {dropDownPageInit, dropDownPageSubs, dropDownPageUpdate} from "./dropdown-page/Update";
import {placementPageInit, placementPageSubs, placementPageUpdate} from "./placement-page/Update";
import {viewPlacementPage} from "./placement-page/ViewPlacementPage";
import {tooltipsPageInit, tooltipsPageUpdate} from "./tooltips-page/Update";
import {viewTooltipsPage} from "./tooltips-page/ViewTooltipsPage";

function init(l: Location): [Model, Cmd<Msg>] {
  return router.parseLocation(l)
      // eslint-disable-next-line array-callback-return
      .map(route => {
        switch (route) {
          case "home": {
            return initHome();
          }
          case "menu": {
            return Tuple.fromNative(menuPageInit())
                .mapFirst(page => ({
                  page
                }))
                .mapSecond(c => c.map(menuPageMsg))
                .toNative();
          }
          case "dropdown": {
            return Tuple.fromNative(dropDownPageInit())
                .mapFirst(page => ({
                  page
                }))
                .mapSecond(c => c.map(dropDownPageMsg))
                .toNative();
          }
          case "tooltip": {
            return Tuple.fromNative(tooltipsPageInit())
                .mapFirst(page => ({
                  page
                }))
                .mapSecond(c => c.map(tooltipPageMsg))
                .toNative();
          }
          case "placement": {
            return Tuple.fromNative(placementPageInit())
                .mapFirst(page => ({
                  page
                }))
                .mapSecond(c => c.map(placementPageMsg))
                .toNative();
          }
        }
      })
      .withDefaultSupply(() => initHome())
}

function initHome(): [Model, Cmd<Msg>] {
  return noCmd(homeModel());
}

function link(dispatch: Dispatcher<Msg>, route: Route, text: string) {
  // eslint-disable-next-line jsx-a11y/anchor-is-valid
  return <a href={'#'} onClick={e => {
    e.preventDefault();
    dispatch(navigate(route));
  }}>
    {text}
  </a>
}

function view(dispatch: Dispatcher<Msg>, model: Model): React.ReactNode {
  const { page } = model;
  switch (page.tag) {
    case "home": {
      return (
          <>
            <h1>tea-pop demo app</h1>
            <ul>
              <li>
                {link(dispatch, 'menu', "Context menu")}
              </li>
              <li>
                {link(dispatch, 'dropdown', "Drop-down")}
              </li>
              <li>
                {link(dispatch, 'tooltip', "Tooltip")}
              </li>
              <li>
                {link(dispatch, 'placement', "Live placement")}
              </li>
            </ul>
          </>
      )
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
    case "tooltips-page": {
      return viewTooltipsPage(map(dispatch, tooltipPageMsg), page);
    }

  }
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
      return Tuple.fromNative(menuPageUpdate(msg.msg, page))
          .mapFirst(page => ({
            page
          }))
          .mapSecond(c => c.map(menuPageMsg))
          .toNative();
    }
    case "dd-page-msg": {
      const { page } = model;
      if (page.tag !== "drop-down-page") {
        return noCmd(model);
      }
      return Tuple.fromNative(dropDownPageUpdate(msg.msg, page))
          .mapFirst(page => ({
            page
          }))
          .mapSecond(c => c.map(dropDownPageMsg))
          .toNative();
    }
    case "tt-page-msg": {
      const { page } = model;
      if (page.tag !== "tooltips-page") {
        return noCmd(model);
      }
      return Tuple.fromNative(tooltipsPageUpdate(msg.msg, page))
          .mapFirst(page => ({
            page
          }))
          .mapSecond(c => c.map(tooltipPageMsg))
          .toNative();
    }
    case "placement-page-msg": {
      const { page } = model;
      if (page.tag !== "placement-page") {
        return noCmd(model);
      }
      return Tuple.fromNative(placementPageUpdate(msg.msg, page))
          .mapFirst(page => ({
            page
          }))
          .mapSecond(c => c.map(placementPageMsg))
          .toNative();
    }
    case "navigate": {
      return Tuple.t2n(model, Task.perform(newUrl(routeToUrl(msg.route)), () => noop));
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
  }
  return Sub.none();
}

export function onUrlChange(l: Location): Msg {
  return {
    tag: "url-change",
    l
  }
}

export const DemoApp = () => (
    <ProgramWithNav
        onUrlChange={onUrlChange}
        init={init}
        view={view}
        update={update}
        subscriptions={subscriptions}
        devTools={DevTools.init<Model, Msg>(window)}
    />
)

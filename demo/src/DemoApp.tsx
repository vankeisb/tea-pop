import * as React from "react";
import {Cmd, DevTools, Dispatcher, noCmd, ProgramWithNav, Sub, Tuple} from "react-tea-cup";
import {homeModel, Model} from "./Model";
import {menuPageMsg, Msg} from "./Msg";
import {router, routeToUrl} from "./routes";
import {viewMenuPage} from "./menu-page/ViewMenuPage";
import {menuPageInit, menuPageSubs, menuPageUpdate} from "./menu-page/Update";

import './App.scss';

function init(l: Location): [Model, Cmd<Msg>] {
  return router.parseLocation(l)
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
            return initHome();
          }
          case "placement": {
            return initHome();
          }
        }
      })
      .withDefaultSupply(() => initHome())
}

function initHome(): [Model, Cmd<Msg>] {
  return noCmd(homeModel());
}

function view(dispatch: Dispatcher<Msg>, model: Model): React.ReactNode {
  const { page } = model;
  switch (page.tag) {
    case "home": {
      return (
          <>
            <h1>tea-pop demo app</h1>
            <p>Bla bla bla</p>
            <ul>
              <li>
                <a href={routeToUrl('home')}>Home</a>
              </li>
              <li>
                <a href={routeToUrl('menu')}>Context menu</a>
              </li>
            </ul>
          </>
      )
    }
    case "menu": {
      return viewMenuPage(dispatch, page);
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
        debugger;
        return noCmd(model);
      }
      return Tuple.fromNative(menuPageUpdate(msg.msg, page))
          .mapFirst(page => ({
            page
          }))
          .mapSecond(c => c.map(menuPageMsg))
          .toNative();
    }
  }
  return noCmd(model);
}

function subscriptions(model: Model): Sub<Msg> {
  const { page } = model;
  switch (page.tag) {
    case "menu": {
      return menuPageSubs(page).map(menuPageMsg);
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

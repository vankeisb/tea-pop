import {gotKeyDown, gotMenuBox, gotUuid, gotWindowDimensions, Msg} from "./Msg";
import {Cmd, Dispatcher, just, noCmd, nothing, Sub, Task, WindowEvents, uuid, Tuple} from "react-tea-cup";
import {menuId, menuStateClosed, menuStatePlacing, Model} from "./Model";
import {Menu} from "./Menu";
import * as React from 'react';
import {ViewMenu} from "./ViewMenu";
import {ItemRenderer} from "./ItemRenderer";
import {pos, Pos} from "../tea-popover/Pos";
import {dim, Dim} from "../tea-popover/Dim";
import {Box} from "../tea-popover/Box";
import {adjustPopover} from "../tea-popover/Popover";

export function init<T>(menu: Menu<T>): [Model<T>, Cmd<Msg>] {
  return [
    {
      uuid: nothing,
      windowSize: nothing,
      menu,
      state: menuStateClosed,
      error: nothing,
    },
    Cmd.batch([
      Task.perform(getWindowDimensions, gotWindowDimensions),
      Task.perform(uuid(), gotUuid)
    ])
  ]
}

export function open<T>(model: Model<T>, position: Pos): [Model<T>, Cmd<Msg>] {
  return model.uuid
      .map(uuid => {
        const newModel: Model<T> = {
          ...model,
          state: menuStatePlacing(position)
        };
        const cmd: Cmd<Msg> = Task.attempt(
            Task.fromLambda(() => {
              const id = menuId(uuid);
              const e = document.getElementById(id);
              if (!e) {
                throw new Error("node not found for id " + id);
              }
              return Box.fromDomRect(e.getBoundingClientRect());
            }),
            gotMenuBox
        );
        return Tuple.t2n(newModel, cmd);
      })
      .withDefaultSupply(() => noCmd(model));
}

export function close<T>(model: Model<T>): [Model<T>, Cmd<Msg>] {
  return noCmd({...model, state: menuStateClosed });
}

export function update<T>(msg: Msg, model: Model<T>): [Model<T>, Cmd<Msg>] {
  switch (msg.tag) {
    case "got-window-dimensions": {
      return noCmd({
        ...model, windowSize: just(msg.d)
      })
    }
    case "got-uuid": {
      return noCmd({
        ...model, uuid: just(msg.uuid)
      })
    }
    case "got-menu-box": {
      return noCmd(
          model.windowSize
              .map(windowSize => {
                const newModel: Model<T> = msg.r.match(
                    box => ({
                      ...model,
                      state: {
                        tag: "open",
                        box: adjustPopover(windowSize, box)
                      }
                    } as Model<T>),
                    err => ({
                      ...model,
                      error: just(err)
                    })
                );
                return newModel;
              })
              .withDefault(model)
      )
    }
    case "key-down": {
      if (msg.key === 'Escape') {
        return close(model);
      }
      return noCmd(model);
    }
  }
}

const windowEvents = new WindowEvents();
const documentEvents = new WindowEvents();

export function subscriptions<T>(model: Model<T>): Sub<Msg> {
  return Sub.batch([
    windowEvents.on('resize', e => gotWindowDimensions(dim(window.innerWidth, window.innerHeight))),
    model.state.tag === 'open'
        ? documentEvents.on('keydown', e => gotKeyDown(e.key))
        : Sub.none()
  ]);
}


const getWindowDimensions: Task<never, Dim> = Task.succeedLazy(() => dim(window.innerWidth, window.innerHeight));

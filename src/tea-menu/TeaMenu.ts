import {gotKeyDown, gotMenuBox, gotUuid, gotWindowDimensions, Msg} from "./Msg";
import {Cmd, just, noCmd, nothing, Sub, Task, Tuple, uuid, WindowEvents} from "react-tea-cup";
import {menuId, menuStateClosed, menuStatePlacing, Model} from "./Model";
import {Menu} from "./Menu";
import {Pos} from "../tea-popover/Pos";
import {dim, Dim} from "../tea-popover/Dim";
import {Box} from "../tea-popover/Box";
import {adjustPopover} from "../tea-popover/Popover";
import {emptyMenuPath, menuPath} from "./MenuPath";

export function init<T>(menu: Menu<T>): [Model<T>, Cmd<Msg<T>>] {
  return [
    {
      uuid: nothing,
      windowSize: nothing,
      menu,
      state: menuStateClosed,
      error: nothing,
      selected: emptyMenuPath,
    },
    Cmd.batch([
      Task.perform(getWindowDimensions, d => gotWindowDimensions(d)),
      Task.perform(uuid(), u => gotUuid(u))
    ])
  ]
}

export function open<T>(model: Model<T>, position: Pos): [Model<T>, Cmd<Msg<T>>] {
  return model.uuid
      .map(uuid => {
        const newModel: Model<T> = {
          ...model,
          state: menuStatePlacing(position)
        };
        const cmd: Cmd<Msg<T>> = Task.attempt(
            Task.fromLambda(() => {
              const id = menuId(uuid);
              const e = document.getElementById(id);
              if (!e) {
                throw new Error("node not found for id " + id);
              }
              return Box.fromDomRect(e.getBoundingClientRect());
            }),
            x => gotMenuBox(x)
        );
        return Tuple.t2n(newModel, cmd);
      })
      .withDefaultSupply(() => noCmd(model));
}

export function close<T>(model: Model<T>): [Model<T>, Cmd<Msg<T>>] {
  return noCmd({...model, state: menuStateClosed});
}

export function update<T>(msg: Msg<T>, model: Model<T>): [Model<T>, Cmd<Msg<T>>] {
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
    case "mouse-enter": {
      return noCmd({
        ...model,
        selected: menuPath(model.menu, msg.item)
      })
    }
  }
}

const windowEvents = new WindowEvents();
const documentEvents = new WindowEvents();

export function subscriptions<T>(model: Model<T>): Sub<Msg<T>> {
  return Sub.batch([
    windowEvents.on('resize', () => gotWindowDimensions(dim(window.innerWidth, window.innerHeight))),
    model.state.tag === 'open'
        ? documentEvents.on('keydown', e => gotKeyDown(e.key))
        : Sub.none()
  ]);
}


const getWindowDimensions: Task<never, Dim> = Task.succeedLazy(() => dim(window.innerWidth, window.innerHeight));

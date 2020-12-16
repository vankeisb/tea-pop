import {childMsg, gotItemBox, gotKeyDown, gotMenuBox, gotUuid, gotWindowDimensions, Msg} from "./Msg";
import {Cmd, just, Maybe, noCmd, nothing, Sub, Task, Tuple, uuid, WindowEvents} from "react-tea-cup";
import {menuStateClosed, menuStatePlacing, Model} from "./Model";
import {Menu, menuId, MenuItem, menuItemId, menuItemTask, menuTask} from "./Menu";
import {pos, Pos} from "./Pos";
import {dim, Dim} from "./Dim";
import {Box} from "./Box";
import {adjustPopover} from "./Popover";

export function init<T>(menu: Menu<T>): [Model<T>, Cmd<Msg<T>>] {
  return [
    initialModel(menu),
    Cmd.batch([
      Task.perform(getWindowDimensions, d => gotWindowDimensions(d)),
      Task.perform(uuid(), u => gotUuid(u))
    ])
  ]
}

export function initialModel<T>(menu: Menu<T>, uuid: Maybe<string> = nothing, windowSize: Maybe<Dim> = nothing): Model<T> {
  return {
    uuid,
    windowSize,
    menu,
    state: menuStateClosed,
    error: nothing,
    child: nothing,
  }
}

export function open<T>(model: Model<T>, position: Pos): [Model<T>, Cmd<Msg<T>>] {
  return model.uuid
      .map(uuid => {
        const newModel: Model<T> = {
          ...model,
          state: menuStatePlacing(position)
        };
        const cmd: Cmd<Msg<T>> = Task.attempt(
            menuTask(uuid).map(e => Box.fromDomRect(e.getBoundingClientRect())),
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
  console.log("update", msg);
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
      switch (msg.key) {
        case 'Escape':
          return close(model);
        case 'ArrowDown':
        case 'ArrowUp': {
          return mapLastMenu(model, lastModel => {

            return noCmd(lastModel)
          })
        }
        default:
          return noCmd(model);
      }
    }
    case "mouse-enter": {
      if (model.uuid.type === 'Nothing') {
        return noCmd(model);
      }
      const uuid = model.uuid.value;
      return Tuple.t2n(model, openSubMenu(uuid, msg.item, msg.itemIndex));
    }
    case "got-item-box": {
      return msg.r.match(
          itemBox => {
            const newModel: Model<T> = {
              ...model,
              menu: model.menu.selectItem(msg.item)
            };
            return msg.item.subMenu
                .map(subMenu => {
                  // we have a sub menu so we need
                  // to open a new Menu !
                  const newChild: Model<T> = initialModel(subMenu, model.uuid.map(uuid => uuid + "_sub"), model.windowSize);
                  const mac = open(newChild, itemBox.p.add(pos(itemBox.d.w, 0)));
                  const newModel2: Model<T> = {
                    ...newModel,
                    child: just(mac[0])
                  };
                  return Tuple.t2n(newModel2, mac[1].map(childMsg))
                })
                .withDefaultSupply(() => {
                  // close any existing child !
                  return newModel.child
                      .map(child => {
                        const mac = close(child);
                        const newModel2: Model<T> = {
                          ...newModel,
                          child: nothing
                        }
                        return Tuple.t2n(newModel2, mac[1].map(childMsg));
                      })
                      .withDefaultSupply(() => noCmd(newModel))
                });
          },
          err => noCmd({...model, error: just(err)})
      )
    }
    case "child-msg": {
      return model.child
          .map(child => {
            const mac = update(msg.m, child);
            const newModel: Model<T> = {
              ...model,
              child: just(mac[0])
            };
            return Tuple.t2n(newModel, mac[1].map(childMsg));
          })
          .withDefaultSupply(() => noCmd(model));
    }
  }
}

function openSubMenu<T>(menuId: string, item: MenuItem<T>, itemIndex: number): Cmd<Msg<T>> {
  return Task.attempt(
      menuItemTask(menuId, itemIndex).map(e => Box.fromDomRect(e.getBoundingClientRect())),
      r => gotItemBox(item, r)
  )
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

function mapLastMenu<T>(model: Model<T>, f: (m: Model<T>) => [Model<T>, Cmd<Msg<T>>]): [Model<T>, Cmd<Msg<T>>] {
  switch (model.child.type) {
    case "Nothing": {
      // I'm the last model !
      return f(model);
    }
    case "Just": {
      const mac = mapLastMenu(model.child.value, f);
      return [
        {...model, child: just(mac[0])},
        mac[1].map(childMsg)
      ]
    }
  }
}

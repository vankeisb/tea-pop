import {childMsg, gotItemBox, gotKeyDown, gotMenuBox, gotUuid, gotWindowDimensions, Msg,} from './Msg';
import {Cmd, just, noCmd, nothing, Sub, Task, Tuple, uuid, WindowEvents,} from 'react-tea-cup';
import {initialModel, Model} from './Model';
import {Menu, MenuItem, menuItemTask, menuTask,} from './Menu';
import {pos, Pos} from './Pos';
import {dim, Dim} from './Dim';
import {Box} from './Box';
import {adjustPopover} from './Popover';

export function open<T>(menu: Menu<T>, position: Pos): [Model<T>, Cmd<Msg<T>>] {
  return [
    initialModel(menu, position),
    Cmd.batch([
      Task.perform(getWindowDimensions, (d) => gotWindowDimensions(d)),
      Task.perform(uuid(), (u) => gotUuid(u)),
    ]),
  ];
}

function postOpen<T>(
  model: Model<T>,
): [Model<T>, Cmd<Msg<T>>] {
  if (model.uuid.type === 'Nothing') {
    return noCmd(model);
  }
  if (model.windowSize.type === 'Nothing') {
    return noCmd(model);
  }
  const cmd: Cmd<Msg<T>> = Task.attempt(
      menuTask(model.uuid.value).map((e) => Box.fromDomRect(e.getBoundingClientRect())),
      (x) => gotMenuBox(x),
  );
  return [model, cmd];
}

export function update<T>(
  msg: Msg<T>,
  model: Model<T>,
): [Model<T>, Cmd<Msg<T>>] {
  console.log('update', msg);
  switch (msg.tag) {
    case 'got-window-dimensions': {
      return postOpen({
        ...model,
        windowSize: just(msg.d),
      });
    }
    case 'got-uuid': {
      return postOpen({
        ...model,
        uuid: just(msg.uuid),
      });
    }
    case 'got-menu-box': {
      return noCmd(
        model.windowSize
          .map((windowSize) => {
            const newModel: Model<T> = msg.r.match(
              (box) =>
                ({
                  ...model,
                  state: {
                    tag: 'open',
                    box: adjustPopover(windowSize, box),
                  },
                } as Model<T>),
              (err) => ({
                ...model,
                error: just(err),
              }),
            );
            return newModel;
          })
          .withDefault(model),
      );
    }

    case 'key-down': {
      switch (msg.key) {
        case 'Escape': {
            return collapseLastSubMenu(model);
        }
        case 'ArrowDown':
        case 'ArrowUp': {
          return mapLastMenu(model, (lastModel) => {
            return noCmd({
              ...lastModel,
              menu: lastModel.menu.moveSelection(msg.key === 'ArrowDown'),
            });
          });
        }
        case 'ArrowLeft':
          return model.child
            .map((child) => {
              const mac = collapseLastSubMenu(child);
              return Tuple.t2n(
                { ...model, child: just(mac[0]) },
                mac[1].map(childMsg),
              );
            })
            .withDefaultSupply(() => noCmd(model));
        case 'ArrowRight':
          return expandLastSubMenu(model);
        default:
          return noCmd(model);
      }
    }
    case 'mouse-enter': {
      if (model.uuid.type === 'Nothing') {
        return noCmd(model);
      }
      // are we on an already selected item ?
      if (model.menu.isSelected(msg.item)) {
        return noCmd(model);
      }
      console.log("mouseEnter", model);
      const menu = model.menu.selectItem(msg.item);
      const uuid = model.uuid.value;
      return Tuple.t2n({...model, menu, child: nothing }, openSubMenu(uuid, msg.item, msg.itemIndex));
    }
    case 'got-item-box': {
      return msg.r.match(
        (itemBox) => {
          const newModel: Model<T> = {
            ...model,
            menu: model.menu.selectItem(msg.item),
          };
          return msg.item.subMenu
            .map((subMenu) => {
              // we have a sub menu so we need
              // to open a new Menu !
              const mac = open(subMenu, itemBox.p.add(pos(itemBox.d.w, 0)));
              const newModel2: Model<T> = {
                ...newModel,
                child: just(mac[0]),
              };
              return Tuple.t2n(newModel2, mac[1].map(childMsg));
            })
            .withDefaultSupply(() => {
              // close any existing child !
              return newModel.child
                .map(() => noCmd<Model<T>,Msg<T>>({...model, child: nothing }))
                .withDefaultSupply(() => noCmd(model));
            });
        },
        (err) => noCmd({ ...model, error: just(err) }),
      );
    }
    case 'child-msg': {
      return model.child
        .map((child) => {
          const mac = update(msg.m, child);
          const newModel: Model<T> = {
            ...model,
            child: just(mac[0]),
          };
          return Tuple.t2n(newModel, mac[1].map(childMsg));
        })
        .withDefaultSupply(() => noCmd(model));
    }
  }
}

function openSubMenu<T>(
  menuId: string,
  item: MenuItem<T>,
  itemIndex: number,
): Cmd<Msg<T>> {
  if (item.subMenu.isNothing()) {
    return Cmd.none();
  }
  return Task.attempt(
    menuItemTask(menuId, itemIndex).map((e) => {
      return Box.fromDomRect(e.getBoundingClientRect());
    }),
    (r) => gotItemBox(item, r),
  );
}

const windowEvents = new WindowEvents();
const documentEvents = new WindowEvents();

export function subscriptions<T>(model: Model<T>): Sub<Msg<T>> {
  return Sub.batch([
    windowEvents.on('resize', () =>
      gotWindowDimensions(dim(window.innerWidth, window.innerHeight)),
    ),
    model.state.tag === 'open'
      ? documentEvents.on('keydown', (e) => gotKeyDown(e.key))
      : Sub.none(),
  ]);
}

const getWindowDimensions: Task<never, Dim> = Task.succeedLazy(() =>
  dim(window.innerWidth, window.innerHeight),
);

function mapLastMenu<T>(
  model: Model<T>,
  f: (m: Model<T>) => [Model<T>, Cmd<Msg<T>>],
): [Model<T>, Cmd<Msg<T>>] {
  switch (model.child.type) {
    case 'Nothing': {
      // I'm the last model !
      return f(model);
    }
    case 'Just': {
      const mac = mapLastMenu(model.child.value, f);
      return [{ ...model, child: just(mac[0]) }, mac[1].map(childMsg)];
    }
  }
}

function collapseLastSubMenu<T>(model: Model<T>): [Model<T>, Cmd<Msg<T>>] {
  // check is my child has no child, and needs to be closed
  return model.child
      .map(() => noCmd<Model<T>,Msg<T>>({...model, child: nothing }))
      .withDefaultSupply(() => noCmd(model));
}

function expandLastSubMenu<T>(model: Model<T>): [Model<T>, Cmd<Msg<T>>] {
  return mapLastMenu(model, (lastModel) => {
    return lastModel.menu.selectedItem
      .map((selectedItem) => {
        return selectedItem.subMenu
          .map(() => {
            console.log('selected item has sub menu...');
            if (lastModel.uuid.type === 'Nothing') {
              return noCmd<Model<T>, Msg<T>>(lastModel);
            }
            const uuid = lastModel.uuid.value;
            const cmd = lastModel.menu
              .indexOfItem(selectedItem)
              .map((itemIndex) => {
                console.log(
                  'opening item #' +
                    itemIndex +
                    ' (' +
                    selectedItem.userData +
                    ')',
                );
                return openSubMenu(uuid, selectedItem, itemIndex);
              })
              .withDefaultSupply(() => Cmd.none<Msg<T>>());
            return Tuple.t2n(lastModel, cmd);
          })
          .withDefaultSupply(() => {
            console.log('selected item has no sub menu');
            return noCmd(lastModel);
          });
        // return noCmd<Model<T>, Msg<T>>(lastModel);
      })
      .withDefaultSupply(() => {
        console.log('no selected item in last model');
        return noCmd(lastModel);
      });
  });
}

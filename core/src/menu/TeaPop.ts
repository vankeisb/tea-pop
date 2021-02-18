/*
 * MIT License
 *
 * Copyright (c) 2020 Rémi Van Keisbelck
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import {
  childMsg,
  docMouseDown,
  gotItemBox,
  gotKeyDown,
  gotMenuBox,
  gotUuid,
  gotWindowDimensions,
  Msg,
  noop,
} from './Msg';
import {
  Cmd,
  DocumentEvents,
  just,
  Maybe,
  noCmd,
  nothing,
  Sub,
  Task,
  Tuple,
  uuid,
  WindowEvents,
} from 'react-tea-cup';
import { initialModel, keyboardNavigated, Model } from './Model';
import { Menu, MenuItem, menuItemTask, menuTask } from './Menu';
import { dim, Dim, Box, place } from '../common';
import { OutMsg } from './OutMsg';

export function open<T>(
  menu: Menu<T>,
  refBox: Box,
  selectFirst = false,
): [Model<T>, Cmd<Msg<T>>] {
  return [
    initialModel(
      selectFirst ? menu.selectFirstItem() : menu.deselectAll(),
      refBox,
    ),
    Cmd.batch([
      Task.perform(getWindowDimensions, (d) => gotWindowDimensions(d)),
      Task.perform(uuid(), (u) => gotUuid(u)),
    ]),
  ];
}

function postOpen<T>(model: Model<T>): [Model<T>, Cmd<Msg<T>>] {
  if (model.uuid.type === 'Nothing') {
    return noCmd(model);
  }
  if (model.windowSize.type === 'Nothing') {
    return noCmd(model);
  }
  const cmd: Cmd<Msg<T>> = Task.attempt(
    menuTask(model.uuid.value).map((e) =>
      Box.fromDomRect(e.getBoundingClientRect()),
    ),
    (x) => gotMenuBox(x),
  );
  return [model, cmd];
}

function withOut<T>(
  mac: [Model<T>, Cmd<Msg<T>>],
  outMsg: Maybe<OutMsg<T>> = nothing,
): [Model<T>, Cmd<Msg<T>>, Maybe<OutMsg<T>>] {
  return [mac[0], mac[1], outMsg];
}

export function update<T>(
  msg: Msg<T>,
  model: Model<T>,
): [Model<T>, Cmd<Msg<T>>, Maybe<OutMsg<T>>] {
  switch (msg.tag) {
    case 'got-window-dimensions': {
      return withOut(
        postOpen({
          ...model,
          windowSize: just(msg.d),
        }),
      );
    }
    case 'got-uuid': {
      return withOut(
        postOpen({
          ...model,
          uuid: just(msg.uuid),
        }),
      );
    }
    case 'got-menu-box': {
      if (model.state.tag === 'placing') {
        const state = model.state;
        return withOut(
          noCmd(
            model.windowSize
              .map((windowSize) => {
                const newModel: Model<T> = msg.r.match(
                  (menuBox) =>
                    ({
                      ...model,
                      state: {
                        tag: 'open',
                        box: place(windowSize, state.refBox, menuBox.d),
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
          ),
        );
      }
      return withOut(noCmd(model));
    }

    case 'key-down': {
      switch (msg.key) {
        case 'Escape': {
          return withOut(
            collapseLastSubMenu(keyboardNavigated(model)),
            model.child.isNothing() ? just({ tag: 'request-close' }) : nothing,
          );
        }
        case 'ArrowDown':
        case 'ArrowUp': {
          return mapLastMenu(keyboardNavigated(model), (lastModel) => {
            return withOut(
              noCmd({
                ...lastModel,
                menu: lastModel.menu.moveSelection(msg.key === 'ArrowDown'),
              }),
            );
          });
        }
        case 'ArrowLeft':
          return withOut(collapseLastSubMenu(keyboardNavigated(model)));
        case 'ArrowRight':
          return expandLastSubMenu(keyboardNavigated(model));
        case 'Enter':
        case ' ': {
          return toggleOrSelectItem(model);
        }
        default:
          return withOut(noCmd(model));
      }
    }
    case 'mouse-move': {
      if (model.menu.isSelected(msg.item)) {
        return withOut(noCmd(model));
      }
      const newModel = { ...model, subMenuCounter: model.subMenuCounter + 1 };
      if (model.navigatedWithKeyboard) {
        return withOut(noCmd(keyboardNavigated(newModel, false)));
      }
      if (model.uuid.type === 'Nothing') {
        return withOut(noCmd(newModel));
      }
      const menu = model.menu.selectItem(msg.item);
      const uuid = model.uuid.value;
      return withOut(
        openSubMenu(
          { ...newModel, menu, child: nothing },
          uuid,
          msg.item,
          msg.itemIndex,
          false,
        ),
      );
    }
    case 'mouse-leave': {
      return withOut(
        noCmd(
          model.child.isJust()
            ? model
            : { ...model, menu: model.menu.deselectAll() },
        ),
      );
    }
    case 'got-item-box': {
      if (msg.subMenuCounter !== model.subMenuCounter) {
        return withOut(noCmd(model));
      }
      return withOut(
        msg.r.match(
          (itemBox) => {
            const newModel: Model<T> = {
              ...model,
              menu: model.menu.selectItem(msg.item),
            };
            return msg.item.subMenu
              .map((subMenu) => {
                // we have a sub menu so we need
                // to open a new Menu !
                const mac = open(subMenu, itemBox, msg.selectFirst);
                const newModel2: Model<T> = {
                  ...newModel,
                  child: just(mac[0]),
                };
                return Tuple.t2n(newModel2, mac[1].map(childMsg));
              })
              .withDefaultSupply(() => {
                // close any existing child !
                return newModel.child
                  .map(() =>
                    noCmd<Model<T>, Msg<T>>({ ...model, child: nothing }),
                  )
                  .withDefaultSupply(() => noCmd(model));
              });
          },
          (err) => noCmd({ ...model, error: just(err) }),
        ),
      );
    }
    case 'child-msg': {
      return model.child
        .map((child) => {
          const mco = update(msg.m, child);
          const newModel: Model<T> = {
            ...model,
            child: just(mco[0]),
          };
          return withOut(Tuple.t2n(newModel, mco[1].map(childMsg)), mco[2]);
        })
        .withDefaultSupply(() => withOut(noCmd(model)));
    }
    case 'item-clicked': {
      return withOut(noCmd(model), outItemSelected(msg.item));
    }
    case 'doc-mouse-down': {
      return withOut(noCmd(model), just({ tag: 'request-close' }));
    }
    case 'noop': {
      return withOut(noCmd(model));
    }
  }
}

function outItemSelected<T>(item: MenuItem<T>): Maybe<OutMsg<T>> {
  return just({ tag: 'item-selected', data: item.userData });
}

function openSubMenu<T>(
  model: Model<T>,
  menuId: string,
  item: MenuItem<T>,
  itemIndex: number,
  selectFirst: boolean,
): [Model<T>, Cmd<Msg<T>>] {
  if (item.subMenu.isNothing()) {
    return noCmd(model);
  }
  const subMenuCounter = model.subMenuCounter + 1;
  return Tuple.t2n(
    { ...model, subMenuCounter },
    Task.attempt(
      menuItemTask(menuId, itemIndex).map((e) => {
        return Box.fromDomRect(e.getBoundingClientRect());
      }),
      (r) => gotItemBox(item, r, subMenuCounter, selectFirst),
    ),
  );
}

const windowEvents = new WindowEvents();
const documentEvents = new DocumentEvents();

export function subscriptions<T>(model: Model<T>): Sub<Msg<T>> {
  return Sub.batch([
    windowEvents.on('resize', () =>
      gotWindowDimensions(dim(window.innerWidth, window.innerHeight)),
    ),
    documentEvents.on('mousedown', (evt) => {
      if (evt.button === 2) {
        return noop();
      }
      let t: HTMLElement | null = evt.target as HTMLElement;
      while (t) {
        // move up and try to find if we are inside a tea-pop Menu !
        if (t.classList.contains('tm')) {
          return noop();
        }
        t = t.parentElement;
      }
      return docMouseDown();
    }),
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
  f: (m: Model<T>) => [Model<T>, Cmd<Msg<T>>, Maybe<OutMsg<T>>],
): [Model<T>, Cmd<Msg<T>>, Maybe<OutMsg<T>>] {
  switch (model.child.type) {
    case 'Nothing': {
      // I'm the last model !
      return f(model);
    }
    case 'Just': {
      const mac = mapLastMenu(model.child.value, f);
      return [{ ...model, child: just(mac[0]) }, mac[1].map(childMsg), mac[2]];
    }
  }
}

function collapseLastSubMenu<T>(model: Model<T>): [Model<T>, Cmd<Msg<T>>] {
  switch (model.child.type) {
    case 'Nothing':
      return noCmd(model);
    case 'Just': {
      // I have a child : close it if he has no child !
      const child = model.child.value;
      if (child.child.isJust()) {
        return Tuple.fromNative(collapseLastSubMenu(child))
          .mapFirst((c) => ({ ...model, child: just(c) }))
          .mapSecond((cmd) => cmd.map(childMsg))
          .toNative();
      } else {
        return noCmd({
          ...model,
          child: nothing,
        });
      }
    }
  }
}

function expandLastSubMenu<T>(
  model: Model<T>,
): [Model<T>, Cmd<Msg<T>>, Maybe<OutMsg<T>>] {
  return mapLastMenu(model, (lastModel) => {
    return lastModel.menu.selectedItem
      .map((selectedItem) => {
        return selectedItem.subMenu
          .map(() => {
            if (lastModel.uuid.type === 'Nothing') {
              return withOut(noCmd<Model<T>, Msg<T>>(lastModel));
            }
            const uuid = lastModel.uuid.value;
            const mac: [Model<T>, Cmd<Msg<T>>] = lastModel.menu
              .indexOfItem(selectedItem)
              .map((itemIndex) => {
                return openSubMenu(
                  lastModel,
                  uuid,
                  selectedItem,
                  itemIndex,
                  true,
                );
              })
              .withDefaultSupply(() => noCmd(lastModel));
            return withOut(mac);
          })
          .withDefaultSupply(() => {
            return withOut(noCmd(lastModel));
          });
      })
      .withDefaultSupply(() => {
        return withOut(noCmd(lastModel));
      });
  });
}

function toggleOrSelectItem<T>(
  model: Model<T>,
): [Model<T>, Cmd<Msg<T>>, Maybe<OutMsg<T>>] {
  return mapLastMenu(model, (lastModel) => {
    return lastModel.menu.selectedItem
      .map((selectedItem) => {
        if (lastModel.uuid.type === 'Nothing') {
          return withOut(noCmd<Model<T>, Msg<T>>(lastModel));
        }
        const uuid = lastModel.uuid.value;
        // do we have a sub-menu ?
        return selectedItem.subMenu
          .map(() => {
            // we have a sub-menu, expand it
            const mac: [Model<T>, Cmd<Msg<T>>] = lastModel.menu
              .indexOfItem(selectedItem)
              .map((itemIndex) =>
                openSubMenu(lastModel, uuid, selectedItem, itemIndex, true),
              )
              .withDefaultSupply(() => noCmd(lastModel));
            return withOut(mac);
          })
          .withDefaultSupply(() => {
            // no sub-menu, select the item
            return withOut(noCmd(lastModel), outItemSelected(selectedItem));
          });
      })
      .withDefaultSupply(() => withOut(noCmd(lastModel)));
  });
}

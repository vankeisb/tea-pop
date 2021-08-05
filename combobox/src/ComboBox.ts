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
  Cmd,
  just,
  ListWithSelection,
  Maybe,
  noCmd,
  nothing,
  Sub,
  Task,
  Tuple,
  updatePiped,
  uuid,
} from 'tea-cup-core';
import { Box } from 'tea-pop-core';
import { dropDownOpen, dropDownUpdate } from 'tea-pop-dropdown';
import { Provider } from './Provider';
import {
  comboHtmlId,
  comboItemHtmlId,
  initialModel,
  Model,
  moveSelection,
} from './Model';
import { dropDownMsg, gotItems, inputFocused, Msg, noOp } from './Msg';
import { OutMsg } from './OutMsg';

export function init<T>(): [Model<T>, Cmd<Msg<T>>] {
  const uuidCmd: Cmd<Msg<T>> = Task.perform(uuid(), (uuid: string) => ({
    tag: 'got-uuid',
    uuid,
  }));

  const model = initialModel<T>();
  return [model, uuidCmd];
}

function fetchFromProvider<T>(
  model: Model<T>,
  provider: Provider<T>,
): [Model<T>, Cmd<Msg<T>>] {
  const newFetchCount = model.fetchCount + 1;
  const newModel: Model<T> = {
    ...model,
    fetchCount: newFetchCount,
  };
  return Tuple.t2n(
    newModel,
    Task.attempt(provider.fetchItems(model.value), (res) =>
      gotItems(res, newFetchCount),
    ),
  );
}

function withOut<T>(
  mac: [Model<T>, Cmd<Msg<T>>],
  outMsg: Maybe<OutMsg> = nothing,
): [Model<T>, Cmd<Msg<T>>, Maybe<OutMsg>] {
  return [mac[0], mac[1], outMsg];
}

export function update<T>(
  provider: Provider<T>,
  msg: Msg<T>,
  model: Model<T>,
): [Model<T>, Cmd<Msg<T>>, Maybe<OutMsg>] {
  switch (msg.tag) {
    case 'got-uuid': {
      return withOut(noCmd({ ...model, uuid: just(msg.uuid) }));
    }
    case 'input-value-changed': {
      const newModel: Model<T> = {
        ...model,
        value: msg.value,
      };
      return withOut(fetchFromProvider(newModel, provider));
    }
    case 'trigger-clicked': {
      return withOut(triggerClicked(model, provider));
    }
    case 'dd-msg': {
      return withOut(
        model.ddModel
          .map((ddModel) => {
            const ddMac = dropDownUpdate(msg.child, ddModel);
            if (ddMac[2]) {
              return noCmd<Model<T>, Msg<T>>({
                ...model,
                ddModel: nothing,
              });
            }
            const newModel: Model<T> = {
              ...model,
              ddModel: just(ddMac[0]),
            };
            return Tuple.t2n(
              newModel,
              ddMac[1].map((x) => dropDownMsg<T>(x)),
            );
          })
          .withDefaultSupply(() => noCmd(model)),
      );
    }
    case 'input-blurred': {
      return withOut(closeCombo(model));
    }
    case 'input-focused': {
      return withOut(noCmd(model));
    }
    case 'input-key-down': {
      switch (msg.key) {
        case 'Escape': {
          return withOut(closeCombo(model));
        }
        case 'Enter': {
          return withOut(
            model.items
              .andThen((i) => i.toMaybe())
              .andThen((items) => items.getSelected())
              .map((item) => selectItem(model, provider, item))
              .withDefaultSupply(() => noCmd(model)),
          );
        }
        case 'ArrowUp': {
          return withOut(handleArrowKey(model, provider, true));
        }
        case 'ArrowDown': {
          return withOut(handleArrowKey(model, provider, false));
        }
        default: {
          return withOut(noCmd(model));
        }
      }
    }
    case 'got-items-from-provider': {
      // ignore if fetch count has changed
      if (msg.fetchCount !== model.fetchCount) {
        return withOut(noCmd(model));
      }
      const newModel: Model<T> = {
        ...model,
        items: just(msg.res.map(ListWithSelection.fromArray)),
      };
      return withOut(triggerCombo(newModel));
    }
    case 'item-clicked': {
      return withOut(selectItem(model, provider, msg.item));
    }
    case 'noop': {
      return withOut(noCmd(model));
    }
  }
}

export function subscriptions<T>(
  model: Model<T>, // eslint-disable-line
): Sub<Msg<T>> {
  return Sub.none();
}

function selectItem<T>(
  model: Model<T>,
  provider: Provider<T>,
  item: T,
): [Model<T>, Cmd<Msg<T>>] {
  const newModel: Model<T> = {
    ...model,
    value: provider.itemToString(item),
  };
  return updatePiped(newModel, closeCombo, (model) =>
    Tuple.t2n(model, focusInputCmd(model)),
  );
}

function triggerCombo<T>(model: Model<T>): [Model<T>, Cmd<Msg<T>>] {
  return model.uuid
    .map((uuid) => {
      const refBoxTask: Task<Error, Box> = Task.fromLambda(() => {
        const e = document.getElementById(comboHtmlId(uuid));
        if (!e) {
          throw new Error('input element not found');
        }
        return Box.fromDomRect(e.getBoundingClientRect());
      });

      const ddMac = dropDownOpen(refBoxTask);
      const newModel: Model<T> = {
        ...model,
        ddModel: just(ddMac[0]),
      };
      const ddCmd: Cmd<Msg<T>> = ddMac[1].map((x) => dropDownMsg<T>(x));

      return Tuple.t2n(newModel, Cmd.batch([ddCmd, focusInputCmd(model)]));
    })
    .withDefaultSupply(() => noCmd(model));
}

function closeCombo<T>(model: Model<T>): [Model<T>, Cmd<Msg<T>>] {
  const newModel: Model<T> = {
    ...model,
    ddModel: nothing,
    fetchCount: model.fetchCount + 1,
  };
  return noCmd(newModel);
}

function focusInputCmd<T>(model: Model<T>): Cmd<Msg<T>> {
  return model.uuid
    .map((uuid) =>
      Task.attempt(
        inputByUuid(uuid).map((e) => {
          e.focus();
          return e;
        }),
        (r) => inputFocused<T>(r),
      ),
    )
    .withDefaultSupply(() => Cmd.none());
}

function inputByUuid(uuid: string): Task<Error, HTMLElement> {
  return byId(comboHtmlId(uuid));
}

function byId(id: string): Task<Error, HTMLElement> {
  return Task.fromLambda(() => {
    const e = document.getElementById(id);
    if (!e) {
      throw new Error('input element not found');
    }
    return e;
  });
}

function triggerClicked<T>(
  model: Model<T>,
  provider: Provider<T>,
): [Model<T>, Cmd<Msg<T>>] {
  const newModel: Model<T> = {
    ...model,
    items: nothing,
  };
  return updatePiped(
    newModel,
    (model) => closeCombo(model),
    (model) => fetchFromProvider(model, provider),
    (model) => triggerCombo(model),
  );
}

function handleArrowKey<T>(
  model: Model<T>,
  provider: Provider<T>,
  isUp: boolean,
): [Model<T>, Cmd<Msg<T>>] {
  // trigger if closed
  return model.ddModel
    .andThen(() =>
      // already open, just move selection
      model.uuid.map((uuid) => {
        const newModel: Model<T> = moveSelection(model, isUp);
        const selectedIndex = newModel.items
          .andThen((x) => x.toMaybe())
          .andThen((items) => items.getSelectedIndex());

        const scrollCmd: Cmd<Msg<T>> = selectedIndex
          .map((selIndex) => {
            const scrollIntoViewTask = byId(
              comboItemHtmlId(uuid, selIndex),
            ).map((e) => {
              e.scrollIntoView(false);
              return true;
            });

            return Task.attempt<Error, boolean, Msg<T>>(
              scrollIntoViewTask,
              () => noOp(),
            );
          })
          .withDefaultSupply(() => Cmd.none());
        return Tuple.t2n(newModel, scrollCmd);
      }),
    )
    .withDefaultSupply(() => {
      // not triggered, trigger and select first
      return triggerClicked(model, provider);
    });
}

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

import * as React from 'react';
import { box, Box, Dim, Pos, getWindowDimensions, placeCombo } from '../common';
import { Cmd, noCmd, Result, Task, uuid } from 'react-tea-cup';

export type Model =
  | { tag: 'fresh'; refBox: Box }
  | { tag: 'ready'; uuid: string; windowDimensions: Dim; state: State };

type State =
  | { tag: 'placing'; refBox: Box }
  | { tag: 'placed'; r: Result<Error, Box> };

export type Msg =
  | { tag: 'got-init-data'; windowDimensions: Dim; uuid: string }
  | { tag: 'got-rendered-box'; r: Result<Error, Box> };

function gotRenderedBox(r: Result<Error, Box>): Msg {
  return {
    tag: 'got-rendered-box',
    r,
  };
}

function gotInitData(windowDimensions: Dim, uuid: string): Msg {
  return {
    tag: 'got-init-data',
    windowDimensions,
    uuid,
  };
}

export type Renderer = () => React.ReactNode;

export function open(refBox: Box): [Model, Cmd<Msg>] {
  const model: Model = {
    tag: 'fresh',
    refBox,
  };
  const cmd: Cmd<Msg> = Task.perform(
    getWindowDimensions.andThen((windowDimensions) =>
      uuid().map((uuid) => ({
        windowDimensions,
        uuid,
      })),
    ),
    ({ windowDimensions, uuid }) => gotInitData(windowDimensions, uuid),
  );
  return [model, cmd];
}

export interface ViewDropDownProps {
  readonly renderer: Renderer;
  readonly model: Model;
}

export function ViewDropDown(props: ViewDropDownProps): React.ReactElement {
  const { renderer, model } = props;
  switch (model.tag) {
    case 'fresh': {
      return <></>;
    }
    case 'ready': {
      switch (model.state.tag) {
        case 'placing': {
          return (
            <span
              id={model.uuid}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                visibility: 'hidden',
              }}
            >
              {renderer()}
            </span>
          );
        }
        case 'placed': {
          const placedBox = model.state.r.withDefaultSupply(() =>
            box(Pos.origin, Dim.zero),
          );
          const { p, d } = placedBox;
          return (
            <div
              className="tm-drop-down"
              style={{
                position: 'absolute',
                top: p.y,
                left: p.x,
                width: d.w,
                height: d.h,
              }}
            >
              {renderer()}
            </div>
          );
        }
      }
    }
  }
}

export function update(msg: Msg, model: Model): [Model, Cmd<Msg>] {
  switch (msg.tag) {
    case 'got-init-data': {
      switch (model.tag) {
        case 'fresh': {
          const newModel: Model = {
            tag: 'ready',
            state: {
              tag: 'placing',
              refBox: model.refBox,
            },
            windowDimensions: msg.windowDimensions,
            uuid: msg.uuid,
          };
          const cmd: Cmd<Msg> = Task.attempt(
            getRenderedBox(msg.uuid),
            gotRenderedBox,
          );
          return [newModel, cmd];
        }
      }
      break;
    }
    case 'got-rendered-box': {
      switch (model.tag) {
        case 'ready': {
          switch (model.state.tag) {
            case 'placing': {
              const s = model.state;
              const state: State = {
                tag: 'placed',
                r: msg.r.map((b) =>
                  placeCombo(model.windowDimensions, s.refBox, b.d),
                ),
              };
              return noCmd({
                ...model,
                state,
              });
            }
          }
        }
      }
      break;
    }
  }
  return noCmd(model);
}

function getRenderedBox(uuid: string): Task<Error, Box> {
  return byId(uuid).map((elem) =>
    Box.fromDomRect(elem.getBoundingClientRect()),
  );
}

function byId(id: string): Task<Error, HTMLElement> {
  return Task.fromLambda(() => {
    const e = document.getElementById(id);
    if (!e) {
      throw new Error('element not found ' + id);
    }
    return e;
  });
}

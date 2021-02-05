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
import { box, Box } from './Box';
import { Cmd, noCmd, Result, Task } from 'react-tea-cup';
import { dim, Dim } from './Dim';
import { Pos } from './Pos';

export type Model =
  | { tag: 'fresh'; refBox: Box }
  | { tag: 'ready'; windowDimensions: Dim; state: State };

type State =
  | { tag: 'placing'; refBox: Box }
  | { tag: 'placed'; r: Result<Error, Box> };

export type Msg =
  | { tag: 'got-window-dimensions'; d: Dim }
  | { tag: 'got-rendered-box'; r: Result<Error, Box> };

function gotWindowDimensions(d: Dim): Msg {
  return {
    tag: 'got-window-dimensions',
    d,
  };
}

function gotRenderedBox(r: Result<Error, Box>): Msg {
  return {
    tag: 'got-rendered-box',
    r,
  };
}

export type Renderer = () => React.ReactNode;
export type NodeFinder = Task<Error, HTMLElement>;

export function open(refBox: Box): [Model, Cmd<Msg>] {
  const model: Model = {
    tag: 'fresh',
    refBox,
  };
  const cmd: Cmd<Msg> = Task.perform(getWindowDimensions, gotWindowDimensions);
  return [model, cmd];
}

export function view(renderer: Renderer, model: Model): React.ReactElement {
  switch (model.tag) {
    case 'fresh': {
      return <></>;
    }
    case 'ready': {
      switch (model.state.tag) {
        case 'placing': {
          return (
            <div
              className="tm-placer"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                overflow: 'hidden',
              }}
            >
              {renderer()}
            </div>
          );
        }
        case 'placed': {
          const placedBox = model.state.r.withDefaultSupply(() =>
            box(Pos.origin, Dim.zero),
          );
          const { p, d } = placedBox;
          return (
            <div
              className="tm"
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

export function update(
  nodeFinder: NodeFinder,
  msg: Msg,
  model: Model,
): [Model, Cmd<Msg>] {
  switch (msg.tag) {
    case 'got-window-dimensions': {
      switch (model.tag) {
        case 'fresh': {
          const newModel: Model = {
            tag: 'ready',
            state: {
              tag: 'placing',
              refBox: model.refBox,
            },
            windowDimensions: msg.d,
          };
          const cmd: Cmd<Msg> = Task.attempt(
            getRenderedBox(nodeFinder),
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
              const state: State = {
                tag: 'placed',
                r: msg.r,
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

function getRenderedBox(nodeFinder: NodeFinder): Task<Error, Box> {
  return nodeFinder.map((elem) =>
    Box.fromDomRect(elem.getBoundingClientRect()),
  );
}

function windowDimensions(): Dim {
  return dim(window.innerWidth, window.innerHeight);
}

const getWindowDimensions: Task<never, Dim> = Task.succeedLazy(() =>
  windowDimensions(),
);

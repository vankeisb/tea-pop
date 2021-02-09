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
import { Box, Dim, getWindowDimensions, placeCombo } from '../common';
import {
  Cmd,
  just,
  Maybe,
  noCmd,
  nothing,
  Result,
  Task,
  uuid,
} from 'react-tea-cup';

export type Model =
  | { tag: 'fresh' }
  | {
      tag: 'ready';
      initData: InitData;
      placed: Maybe<Box>;
    }
  | { tag: 'error'; e: Error };

function errorModel(e: Error): Model {
  return {
    tag: 'error',
    e,
  };
}

interface InitData {
  readonly refBox: Box;
  readonly windowDimensions: Dim;
  readonly uuid: string;
}

export type Msg =
  | { tag: 'got-init-data'; r: Result<Error, InitData> }
  | { tag: 'got-rendered-box'; r: Result<Error, Box> };

function gotRenderedBox(r: Result<Error, Box>): Msg {
  return {
    tag: 'got-rendered-box',
    r,
  };
}

function gotInitData(r: Result<Error, InitData>): Msg {
  return {
    tag: 'got-init-data',
    r,
  };
}

export type Renderer = () => React.ReactNode;

export function open(getRefBox: Task<Error, Box>): [Model, Cmd<Msg>] {
  const model: Model = {
    tag: 'fresh',
  };
  const getInitData: Task<Error, InitData> = getRefBox.andThen((refBox) =>
    getWindowDimensions.andThen((windowDimensions) =>
      uuid().map((uuid) => ({ refBox, windowDimensions, uuid })),
    ),
  );

  const cmd: Cmd<Msg> = Task.attempt(getInitData, gotInitData);
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
    case 'error': {
      return <></>; // TODO ?
    }
    case 'ready': {
      return model.placed
        .map((placedBox) => {
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
        })
        .withDefaultSupply(() => {
          return (
            <span
              id={model.initData.uuid}
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
        });
    }
  }
}

export function update(msg: Msg, model: Model): [Model, Cmd<Msg>] {
  switch (msg.tag) {
    case 'got-init-data': {
      if (model.tag !== 'fresh') {
        return noCmd(model);
      }
      return msg.r.match(
        (initData) => {
          const newModel: Model = {
            tag: 'ready',
            initData,
            placed: nothing,
          };
          const cmd: Cmd<Msg> = Task.attempt(
            getRenderedBox(initData.uuid),
            gotRenderedBox,
          );
          return [newModel, cmd];
        },
        (error) => noCmd(errorModel(error)),
      );
    }
    case 'got-rendered-box': {
      return msg.r.match(
        (renderedBox) => {
          if (model.tag !== 'ready') {
            return noCmd(model);
          }
          const { initData } = model;
          const { windowDimensions, refBox } = initData;
          const placedBox = placeCombo(windowDimensions, refBox, renderedBox.d);
          return noCmd({
            ...model,
            placed: just(placedBox),
          });
        },
        (error) => noCmd(errorModel(error)),
      );
    }
  }
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

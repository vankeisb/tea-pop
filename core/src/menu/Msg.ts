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

import { Dim, Box } from '../common';
import { Result } from 'react-tea-cup';
import { MenuItem } from './Menu';

export type Msg<T> =
  | { tag: 'got-window-dimensions'; d: Dim }
  | { tag: 'got-uuid'; uuid: string }
  | { tag: 'got-menu-box'; r: Result<Error, Box> }
  | { tag: 'key-down'; key: string }
  | { tag: 'mouse-move'; item: MenuItem<T>; itemIndex: number }
  | { tag: 'mouse-leave'; item: MenuItem<T>; itemIndex: number }
  | {
      tag: 'got-item-box';
      item: MenuItem<T>;
      r: Result<Error, Box>;
      selectFirst: boolean;
      subMenuCounter: number;
    }
  | { tag: 'item-clicked'; item: MenuItem<T> }
  | { tag: 'child-msg'; m: Msg<T> }
  | { tag: 'doc-mouse-down' }
  | { tag: 'noop' };

export function noop<T>(): Msg<T> {
  return { tag: 'noop' };
}

export function gotWindowDimensions<T>(d: Dim): Msg<T> {
  return {
    tag: 'got-window-dimensions',
    d,
  };
}

export function gotUuid<T>(uuid: string): Msg<T> {
  return {
    tag: 'got-uuid',
    uuid,
  };
}

export function gotMenuBox<T>(r: Result<Error, Box>): Msg<T> {
  return {
    tag: 'got-menu-box',
    r,
  };
}

export function gotKeyDown<T>(key: string): Msg<T> {
  return {
    tag: 'key-down',
    key,
  };
}

export function childMsg<T>(m: Msg<T>): Msg<T> {
  return {
    tag: 'child-msg',
    m,
  };
}

export function gotItemBox<T>(
  item: MenuItem<T>,
  r: Result<Error, Box>,
  subMenuCounter: number,
  selectFirst: boolean,
): Msg<T> {
  return {
    tag: 'got-item-box',
    item,
    selectFirst,
    r,
    subMenuCounter,
  };
}

export function docMouseDown<T>(): Msg<T> {
  return {
    tag: 'doc-mouse-down',
  };
}

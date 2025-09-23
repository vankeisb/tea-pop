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

import { Result } from 'tea-cup-fp';
import { DropDownMsg } from 'tea-pop-dropdown';

export type Msg<T> =
  | { tag: 'input-value-changed'; value: string }
  | { tag: 'trigger-clicked' }
  | { tag: 'got-uuid'; uuid: string }
  | { tag: 'dd-msg'; child: DropDownMsg }
  | { tag: 'input-blurred' }
  | { tag: 'input-focused'; res: Result<Error, HTMLElement> }
  | { tag: 'input-key-down'; key: string }
  | {
      tag: 'got-items-from-provider';
      res: Result<Error, ReadonlyArray<T>>;
      fetchCount: number;
    }
  | { tag: 'item-clicked'; item: T }
  | { tag: 'noop' };

export function dropDownMsg<T>(child: DropDownMsg): Msg<T> {
  return {
    tag: 'dd-msg',
    child,
  };
}

export function inputFocused<T>(res: Result<Error, HTMLElement>): Msg<T> {
  return {
    tag: 'input-focused',
    res,
  };
}

export function gotItems<T>(
  res: Result<Error, ReadonlyArray<T>>,
  fetchCount: number,
): Msg<T> {
  return {
    tag: 'got-items-from-provider',
    res,
    fetchCount,
  };
}

export function noOp<T>(): Msg<T> {
  return {
    tag: 'noop',
  };
}

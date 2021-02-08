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

import { Menu } from './Menu';
import { Maybe, nothing } from 'react-tea-cup';
import { Box, Dim } from '../common';

export interface Model<T> {
  readonly uuid: Maybe<string>;
  readonly windowSize: Maybe<Dim>;
  readonly menu: Menu<T>;
  readonly state: MenuState;
  readonly error: Maybe<Error>;
  readonly child: Maybe<Model<T>>;
  readonly navigatedWithKeyboard: boolean;
  readonly subMenuCounter: number;
}

export function initialModel<T>(menu: Menu<T>, refBox: Box): Model<T> {
  return {
    uuid: nothing,
    windowSize: nothing,
    menu,
    state: menuStatePlacing(refBox),
    error: nothing,
    child: nothing,
    navigatedWithKeyboard: false,
    subMenuCounter: 0,
  };
}

export type MenuState =
  | { tag: 'placing'; refBox: Box }
  | { tag: 'open'; box: Box };

export function menuStatePlacing(refBox: Box): MenuState {
  return {
    tag: 'placing',
    refBox,
  };
}

export function keyboardNavigated<T>(
  model: Model<T>,
  navigatedWithKeyboard = true,
): Model<T> {
  return { ...model, navigatedWithKeyboard };
}

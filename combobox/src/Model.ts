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

import { ListWithSelection, Maybe, nothing, Result } from 'tea-cup-core';
import { DropDownModel } from 'tea-pop-dropdown';

export interface Model<T> {
  readonly uuid: Maybe<string>;
  readonly value: string;
  readonly ddModel: Maybe<DropDownModel>;
  readonly items: Maybe<Result<Error, ListWithSelection<T>>>;
  readonly fetchCount: number;
}

export function initialModel<T>(): Model<T> {
  return {
    uuid: nothing,
    value: '',
    ddModel: nothing,
    items: nothing,
    fetchCount: 0,
  };
}

export function comboHtmlId(uuid: string): string {
  return 'tp-cb-' + uuid;
}

export function comboItemHtmlId(uuid: string, index: number): string {
  return 'tp-cb-item-' + uuid + '-' + index;
}

export function moveSelection<T>(model: Model<T>, up: boolean): Model<T> {
  return {
    ...model,
    items: model.items.map((r) =>
      r.map((items) => {
        const nbItems = items.length();
        const curIndex = items.getSelectedIndex().withDefault(-1);
        const newIndex = up ? curIndex - 1 : curIndex + 1;
        const fixed =
          newIndex < 0 ? nbItems - 1 : newIndex >= nbItems ? 0 : newIndex;

        return items.selectIndex(fixed);
      }),
    ),
  };
}

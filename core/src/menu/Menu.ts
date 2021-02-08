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
  just,
  ListWithSelection,
  Maybe,
  maybeOf,
  nothing,
  Task,
} from 'react-tea-cup';

export class Menu<T> {
  constructor(private readonly elements: ListWithSelection<MenuElement<T>>) {}

  selectFirstItem(): Menu<T> {
    return new Menu(this.elements.selectIndex(0));
  }

  selectItem(item: MenuItem<T>): Menu<T> {
    return new Menu(this.elements.select((e) => e === item));
  }

  deselectAll(): Menu<T> {
    return new Menu(ListWithSelection.fromArray(this.elements.toArray()));
  }

  get elems(): ReadonlyArray<MenuElement<T>> {
    return this.elements.toArray();
  }

  get selectedItem(): Maybe<MenuItem<T>> {
    const selected = this.elements.getSelected();
    if (selected.type === 'Just' && selected.value.tag === 'item') {
      return just(selected.value);
    }
    return nothing;
  }

  isSelected(item: MenuItem<T>): boolean {
    return this.elements.isSelected(item);
  }

  private findNextItemIndex(start: number): Maybe<number> {
    const elems = this.elems;
    const s = start === elems.length - 1 ? 0 : start + 1;
    for (let i = s; i < elems.length; i++) {
      if (elems[i].tag === 'item') {
        return just(i);
      }
    }
    return nothing;
  }

  private findPreviousItemIndex(start: number): Maybe<number> {
    const elems = this.elems;
    const s = start === 0 ? elems.length - 1 : start - 1;
    for (let i = s; i >= 0; i--) {
      if (elems[i].tag === 'item') {
        return just(i);
      }
    }
    return nothing;
  }

  moveSelection(down: boolean): Menu<T> {
    return this.elements
      .getSelectedIndex()
      .map((selectedIndex) => {
        const mbNextIndex = down
          ? this.findNextItemIndex(selectedIndex)
          : this.findPreviousItemIndex(selectedIndex);
        return mbNextIndex
          .map((nextIndex) => new Menu(this.elements.selectIndex(nextIndex)))
          .withDefault(this);
      })
      .withDefaultSupply(() => {
        return new Menu(
          this.elements.selectIndex(down ? 0 : this.elements.length() - 1),
        );
      });
  }

  indexOfItem(item: MenuItem<T>): Maybe<number> {
    const i = this.elements.toArray().indexOf(item);
    if (i === -1) {
      return nothing;
    }
    return just(i);
  }
}

export type MenuElement<T> = MenuItem<T> | MenuSeparator;

export interface MenuItem<T> {
  tag: 'item';
  readonly userData: T;
  readonly subMenu: Maybe<Menu<T>>;
}

export interface MenuSeparator {
  tag: 'separator';
}

export function menu<T>(items: ReadonlyArray<MenuElement<T>>): Menu<T> {
  return new Menu(ListWithSelection.fromArray(items));
}

export function item<T>(userData: T, subMenu?: Menu<T>): MenuItem<T> {
  return {
    tag: 'item',
    userData,
    subMenu: maybeOf(subMenu),
  };
}

export const separator: MenuSeparator = {
  tag: 'separator',
};

export function menuId(uuid: string): string {
  return `tm-${btoa(uuid)}`;
}

export function menuItemId(menuId: string, itemIndex: number): string {
  return `tm-item-${menuId}-${itemIndex}`;
}

export function menuTask(uuid: string): Task<Error, HTMLElement> {
  return byId(menuId(uuid));
}

export function menuItemTask(
  menuId: string,
  itemIndex: number,
): Task<Error, HTMLElement> {
  return byId(menuItemId(menuId, itemIndex));
}

function byId(id: string): Task<Error, HTMLElement> {
  return Task.fromLambda(() => {
    const e = document.getElementById(id);
    if (e === null) {
      throw new Error('element not found with id:' + id);
    }
    return e;
  });
}

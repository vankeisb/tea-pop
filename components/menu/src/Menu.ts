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

import { Box, dim, place } from 'tea-pop-core';
import { div, findWithParents, slot, style } from './HtmlBuilder';
import { MenuItem } from './MenuItem';

export type MenuListener<K extends keyof MenuEventMap> = (
  evt: MenuEventMap[K],
) => void;

export interface MenuEventMap {
  open: OpenEvent;
  close: CloseEvent;
  itemSelected: ItemSelectedEvent;
}

export interface CloseEvent {
  readonly menu: Menu;
}

export interface OpenEvent {
  readonly menu: Menu;
}

export interface ItemSelectedEvent {
  readonly menu: Menu;
  readonly item: MenuItem;
}

export class Menu extends HTMLElement {
  private readonly listeners: Map<
    keyof MenuEventMap,
    MenuListener<any>[]
  > = new Map();

  private _dom?: HTMLDivElement;
  private _active: boolean = false;
  private _open: boolean = false;

  private readonly docMouseDown = (e: MouseEvent) => {
    const t = findWithParents(
      e.target as HTMLElement,
      (elem) => elem instanceof Menu,
    );
    if (!t) {
      this.close();
    }
  };

  private readonly docKeyPress = (e: KeyboardEvent) => {
    if (this._active) {
      e.stopPropagation();
      e.preventDefault();
      switch (e.key) {
        case 'Escape': {
          this.close();
          break;
        }
        case 'ArrowDown': {
          this.moveToNextItem();
          break;
        }
        case 'ArrowUp': {
          this.moveToPrevItem();
          break;
        }
        case 'Space':
        case 'Enter': {
          this.selectCurrentItem();
          break;
        }
        default: {
          break;
        }
      }
    }
  };

  constructor() {
    super();
  }

  set active(active: boolean) {
    this._active = active;
  }

  get active(): boolean {
    return this._active;
  }

  get isOpen(): boolean {
    return this._open;
  }

  private selectCurrentItem() {
    const item = this.findItems().find((i) => i.active);
    if (item) {
      this.menuItemSelected(this, item);
    }
  }

  private moveToNextItem() {
    const items = this.findItems();
    if (items.length > 0) {
      let activeIndex = items.findIndex((i) => i.active);
      if (activeIndex < items.length - 1) {
        activeIndex++;
      } else {
        activeIndex = 0;
      }
      items[activeIndex].active = true;
    }
  }

  private moveToPrevItem() {
    const items = this.findItems();
    if (items.length > 0) {
      let activeIndex = items.findIndex((i) => i.active);
      if (activeIndex > 0) {
        activeIndex--;
      } else {
        activeIndex = items.length - 1;
      }
      items[activeIndex].active = true;
    }
  }

  addMenuListener<K extends keyof MenuEventMap>(
    type: K,
    listener: MenuListener<K>,
  ): void {
    let ls = this.listeners.get(type);
    if (!ls) {
      ls = [];
      this.listeners.set(type, ls);
    }
    ls.push(listener);
  }

  removeMenuListener<K extends keyof MenuEventMap>(
    type: K,
    listener: MenuListener<K>,
  ): void {
    let ls = this.listeners.get(type);
    if (ls) {
      ls = ls.filter((l) => l !== listener);
      this.listeners.set(type, ls);
    }
  }

  private fireEvent<K extends keyof MenuEventMap>(
    type: K,
    evt: MenuEventMap[K],
  ): void {
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach((h) => {
        h(evt);
      });
    }
  }

  private findItems(): ReadonlyArray<MenuItem> {
    return Array.from(this.querySelectorAll('tp-menu-item')).flatMap((n) => {
      if (n instanceof MenuItem && n.findParentMenu() === this) {
        return [n];
      }
      return [];
    });
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });

    const wrapper = div(
      [
        style({
          position: 'absolute',
          top: '0',
          left: '0',
          visibility: 'hidden',
        }),
      ],
      slot([]),
    );

    shadow.appendChild(wrapper);
    this._dom = wrapper;
  }

  menuItemSelected(menu: Menu, item: MenuItem) {
    this.fireEvent('itemSelected', { menu, item });
  }

  menuItemActive(item: MenuItem) {
    this.findItems().forEach((i) => {
      if (i !== item) {
        i.active = false;
      }
    });
  }

  closeAllSubMenus() {
    this.findItems().forEach((i) => i.closeSubMenu());
  }

  open(refBox: Box): void {
    // console.log('Menu open', this);
    if (this._dom) {
      const viewportDim = dim(window.innerWidth, window.innerHeight);
      const menuBox = Box.fromDomRect(this._dom.getBoundingClientRect());
      //      const scrollOffsets = pos(window.scrollX, window.scrollY);
      //      const translatedRefBox = new Box(refBox.p.add(scrollOffsets), refBox.d);
      const placedBox = place(viewportDim, refBox, menuBox.d);
      this._dom.style.display = 'block';
      this._dom.style.position = 'fixed';
      this._dom.style.top = placedBox.p.y + 'px';
      this._dom.style.left = placedBox.p.x + 'px';
      this._dom.style.visibility = 'visible';
    }
    this.active = true;
    this._open = true;
    this.installListeners();
    this.fireEvent('open', { menu: this });
  }

  close(): void {
    // console.log('Menu close', this);
    this.closeAllSubMenus();
    if (this._dom) {
      this._dom.style.position = 'absolute';
      this._dom.style.visibility = 'hidden';
      this._dom.style.top = '0';
      this._dom.style.left = '0';
    }
    this.active = false;
    this.removeListeners();
    this.findItems().forEach((i) => {
      i.active = false;
    });
    this._open = false;
    this.fireEvent('close', { menu: this });
  }

  private installListeners() {
    document.addEventListener('mousedown', this.docMouseDown, {
      capture: true,
    });
    document.addEventListener('keydown', this.docKeyPress);
  }

  private removeListeners() {
    document.removeEventListener('mousedown', this.docMouseDown, {
      capture: true,
    });
    document.removeEventListener('keydown', this.docKeyPress);
  }
}

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

import {className, div} from "./HtmlBuilder";
import {Box, dim, place} from "tea-pop-core";

export type ElementRenderer<T> = (element: MenuElement<T>) => HTMLDivElement;

class Handle<K extends keyof HTMLElementEventMap> {
  readonly elem: HTMLElement;
  readonly type: K;
  readonly listener: (evt:HTMLElementEventMap[K]) => void;

  constructor(elem: HTMLElement, type: K, listener: (evt:HTMLElementEventMap[K]) => void) {
    this.elem = elem;
    this.type = type;
    this.listener = listener;
    this.elem.addEventListener(this.type, listener);
  }

  remove() {
    this.elem.removeEventListener(this.type, this.listener);
  }
}

export type MenuElement<T> =
  | { tag: 'item', item: MenuItem<T> }
  | { tag: 'separator' }

export class Menu<T> {

  private _elements: readonly MenuElement<T>[] = [];
  private _itemElems: HTMLElement[] = [];
  private _elem?: HTMLElement;
  private readonly _renderer: ElementRenderer<T>;
  private _subMenu?: Menu<T>;

  private _handles: Handle<any>[] = [];

  constructor(renderer: ElementRenderer<T>, elements: readonly MenuElement<T>[]) {
    this._renderer = renderer;
    this._elements = elements;
  }

  private readonly docMouseDown = (e: MouseEvent) => {
    this.close();
  }

  private own<K extends keyof HTMLElementEventMap>(elem: HTMLElement, type: K, listener: (e: HTMLElementEventMap[K]) => void): (e:HTMLElementEventMap[K]) => void {
    const h = new Handle(elem, type, listener);
    this._handles.push(h);
    return listener;
  }

  open(refBox: Box) {
    if (this._elem) {
      this.close();
    }
    this._itemElems = [];
    const elem = div([className('tp-menu')]);
    this._elements.forEach((item, itemIndex) => {
      const itemElem = this._renderer(item);
      if (item.tag === "item") {
        this.own(itemElem, 'mouseenter', () => {
          this.openSubMenu(item.item, itemElem);
        });
      }
      this._itemElems.push(itemElem);
      elem.appendChild(itemElem);
    });
    const s = elem.style;
    s.position = 'absolute';
    s.top = '0';
    s.left = '0';
    s.visibility = 'hidden';
    s.display = 'flex';
    s.flexDirection = 'column';
    document.body.appendChild(elem);
    this._elem = elem;
    const viewportDim = dim(window.innerWidth, window.innerHeight);
    const menuBox = Box.fromDomRect(elem.getBoundingClientRect());
    const placedBox = place(viewportDim, refBox, menuBox.d);
    elem.style.position = 'fixed';
    elem.style.top = placedBox.p.y + 'px';
    elem.style.left = placedBox.p.x + 'px';
    elem.style.visibility = 'visible';
    elem.classList.add("tp-open");
    document.addEventListener('mousedown', this.docMouseDown);
  }

  close() {
    this.closeSubMenu();
    this._handles.forEach(h => h.remove());
    this._itemElems.forEach(ie => {
      ie.remove();
    });
    this._itemElems = [];
    if (this._elem) {
      this._elem.remove();
    }
    this._elem = undefined;

    document.removeEventListener('mousedown', this.docMouseDown);
  }

  private openSubMenu(item: MenuItem<T>, itemElem: HTMLElement) {
    this.closeSubMenu();
    if (item.subMenu) {
      const subMenu = item.subMenu();
      const elemBox = Box.fromDomRect(itemElem.getBoundingClientRect());
      subMenu.open(elemBox);
      this._subMenu = subMenu;
    }
  }

  private closeSubMenu() {
    if (this._subMenu) {
      this._subMenu.close();
      this._subMenu = undefined;
    }
  }

}

export class MenuItem<T> {

  readonly data: T;
  readonly subMenu?: () => Menu<T>;

  constructor(data: T, subMenu?: () => Menu<T>) {
    this.data = data;
    this.subMenu = subMenu;
  }

}

export function menu<T>(renderer: ElementRenderer<T>, ...items: readonly MenuElement<T>[]): Menu<T> {
  return new Menu<T>(renderer, items);
}

export function item<T>(data: T, subMenu?: () => Menu<T>): MenuElement<T> {
  return toElem(new MenuItem<T>(data, subMenu));
}

function toElem<T>(item: MenuItem<T>): MenuElement<T> {
  return { tag: "item", item };
}

export const separator: MenuElement<never> = { tag: "separator" }

//
// import { Box, dim, place } from 'tea-pop-core';
// import { div, findWithParents, slot, style } from './HtmlBuilder';
// import { MenuItem } from './MenuItem';
//
// export type MenuListener<K extends keyof MenuEventMap> = (
//   evt: MenuEventMap[K],
// ) => void;
//
// export interface MenuEventMap {
//   open: OpenEvent;
//   close: CloseEvent;
//   itemSelected: ItemSelectedEvent;
// }
//
// export interface CloseEvent {
//   readonly menu: Menu;
// }
//
// export interface OpenEvent {
//   readonly menu: Menu;
// }
//
// export interface ItemSelectedEvent {
//   readonly menu: Menu;
//   readonly item: MenuItem;
// }
//
// export class Menu extends HTMLElement {
//   private readonly listeners: Map<
//     keyof MenuEventMap,
//     MenuListener<any>[]
//   > = new Map();
//
//   private _dom?: HTMLDivElement;
//   private _focused: boolean = false;
//   private _open: boolean = false;
//
//   private readonly docMouseDown = (e: MouseEvent) => {
//     const t = findWithParents(
//       e.target as HTMLElement,
//       (elem) => elem instanceof Menu,
//     );
//     if (!t) {
//       this.close();
//     }
//   };
//
//   private readonly docKeyPress = (e: KeyboardEvent) => {
//     if (this._focused) {
//       e.stopPropagation();
//       e.preventDefault();
//       switch (e.key) {
//         case 'Escape': {
//           this.close();
//           break;
//         }
//         case 'ArrowDown': {
//           this.moveToNextItem();
//           break;
//         }
//         case 'ArrowUp': {
//           this.moveToPrevItem();
//           break;
//         }
//         case 'Space':
//         case 'Enter': {
//           this.selectCurrentItem();
//           break;
//         }
//         default: {
//           break;
//         }
//       }
//     }
//   };
//
//   constructor() {
//     super();
//   }
//
//   set focused(active: boolean) {
//     this._focused = active;
//   }
//
//   get focused(): boolean {
//     return this._focused;
//   }
//
//   get isOpen(): boolean {
//     return this._open;
//   }
//
//   private selectCurrentItem() {
//     const item = this.findItems().find((i) => i.focused);
//     if (item) {
//       this.menuItemSelected(this, item);
//     }
//   }
//
//   private moveToNextItem() {
//     const items = this.findItems();
//     if (items.length > 0) {
//       let activeIndex = items.findIndex((i) => i.focused);
//       if (activeIndex < items.length - 1) {
//         activeIndex++;
//       } else {
//         activeIndex = 0;
//       }
//       items[activeIndex].focused = true;
//     }
//   }
//
//   private moveToPrevItem() {
//     const items = this.findItems();
//     if (items.length > 0) {
//       let activeIndex = items.findIndex((i) => i.focused);
//       if (activeIndex > 0) {
//         activeIndex--;
//       } else {
//         activeIndex = items.length - 1;
//       }
//       items[activeIndex].focused = true;
//     }
//   }
//
//   addMenuListener<K extends keyof MenuEventMap>(
//     type: K,
//     listener: MenuListener<K>,
//   ): void {
//     let ls = this.listeners.get(type);
//     if (!ls) {
//       ls = [];
//       this.listeners.set(type, ls);
//     }
//     ls.push(listener);
//   }
//
//   removeMenuListener<K extends keyof MenuEventMap>(
//     type: K,
//     listener: MenuListener<K>,
//   ): void {
//     let ls = this.listeners.get(type);
//     if (ls) {
//       ls = ls.filter((l) => l !== listener);
//       this.listeners.set(type, ls);
//     }
//   }
//
//   private fireEvent<K extends keyof MenuEventMap>(
//     type: K,
//     evt: MenuEventMap[K],
//   ): void {
//     const handlers = this.listeners.get(type);
//     if (handlers) {
//       handlers.forEach((h) => {
//         h(evt);
//       });
//     }
//   }
//
//   private findItems(): ReadonlyArray<MenuItem> {
//     return Array.from(this.querySelectorAll('tp-menu-item')).flatMap((n) => {
//       if (n instanceof MenuItem && n.findParentMenu() === this) {
//         return [n];
//       }
//       return [];
//     });
//   }
//
//   private setHiddenStyles() {
//     const d = this._dom;
//     if (d) {
//       d.style.position = 'absolute';
//       d.style.top = '0';
//       d.style.left = '0';
//       d.style.visibility = 'hidden';
//     }
//   }
//
//   connectedCallback() {
//     this._dom = div(
//       [
//         style({
//           position: 'absolute',
//           top: '0',
//           left: '0',
//           visibility: 'hidden',
//         }),
//       ],
//       slot([]),
//     );
//     this.appendChild(this._dom);
//   }
//
//   menuItemSelected(menu: Menu, item: MenuItem) {
//     this.fireEvent('itemSelected', { menu, item });
//   }
//
//   menuItemFocused(item: MenuItem) {
//     this.findItems().forEach((i) => {
//       if (i !== item) {
//         i.focused = false;
//       }
//     });
//   }
//
//   closeAllSubMenus() {
//     this.findItems().forEach((i) => i.closeSubMenu());
//   }
//
//   open(refBox: Box): void {
//     document.body.appendChild(this);
//     // console.log('Menu open', this);
//     if (this._dom) {
//       const viewportDim = dim(window.innerWidth, window.innerHeight);
//       const menuBox = Box.fromDomRect(this._dom.getBoundingClientRect());
//       //      const scrollOffsets = pos(window.scrollX, window.scrollY);
//       //      const translatedRefBox = new Box(refBox.p.add(scrollOffsets), refBox.d);
//       const placedBox = place(viewportDim, refBox, menuBox.d);
//       this._dom.style.display = 'block';
//       this._dom.style.position = 'fixed';
//       this._dom.style.visibility = 'visible';
//       this._dom.style.top = placedBox.p.y + 'px';
//       this._dom.style.left = placedBox.p.x + 'px';
//     }
//     this.focused = true;
//     this._open = true;
//     this.installListeners();
//     this.fireEvent('open', { menu: this });
//   }
//
//   close(): void {
//     // console.log('Menu close', this);
//     this.closeAllSubMenus();
//     if (this._dom) {
//       this._dom.style.position = 'absolute';
//       this._dom.style.visibility = 'hidden';
//       this._dom.style.top = '0';
//       this._dom.style.left = '0';
//     }
//     this.focused = false;
//     this.removeListeners();
//     this.findItems().forEach((i) => {
//       i.focused = false;
//     });
//     this._open = false;
//     this.fireEvent('close', { menu: this });
//   }
//
//   private installListeners() {
//     document.addEventListener('mousedown', this.docMouseDown, {
//       capture: true,
//     });
//     document.addEventListener('keydown', this.docKeyPress);
//   }
//
//   private removeListeners() {
//     document.removeEventListener('mousedown', this.docMouseDown, {
//       capture: true,
//     });
//     document.removeEventListener('keydown', this.docKeyPress);
//   }
// }

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
import { div, input, slot, text } from './HtmlBuilder';

function findWithParents(elem: HTMLElement | null, matcher: (p:HTMLElement) => boolean): HTMLElement | null {
  if (elem === null) {
    return null;
  } else {
    if (matcher(elem)) {
      return elem;
    } else {
      return findWithParents(elem.parentElement, matcher);
    }
  }
}

export type MenuListener<K extends keyof MenuEventMap> = (
  evt: MenuEventMap[K]
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

  private readonly listeners: Map<keyof MenuEventMap, MenuListener<any>[]> = new Map();
  private dom?: HTMLDivElement;

  private readonly docMouseDown = (e: MouseEvent) => {
    const t = findWithParents(e.target as HTMLElement, elem => elem instanceof Menu);
    if (!t) {
      this.close();
    }
  }

  private readonly docKeyPress = (e: KeyboardEvent) => {
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
      default: {
        break;
      }
    }
  }

  constructor() {
    super();
  }

  private moveToNextItem() {
    const items = this.findItems();
    if (items.length > 0) {
      let activeIndex = items.findIndex(i => i.active);
      if (activeIndex < items.length - 1) {
        activeIndex++
      } else {
        activeIndex = 0;
      }
      items[activeIndex].active = true; 
    }
  }

  private moveToPrevItem() {
    const items = this.findItems();
    if (items.length > 0) {
      let activeIndex = items.findIndex(i => i.active);
      if (activeIndex > 0) {
        activeIndex--;
      } else {
        activeIndex = items.length - 1;
      }
      items[activeIndex].active = true; 
    }
  }

  addMenuListener<K extends keyof MenuEventMap>(type: K, listener: MenuListener<K>): void {
    let ls = this.listeners.get(type);
    if (!ls) {
      ls = [];
      this.listeners.set(type, ls);
    }
    ls.push(listener);
  }

  removeMenuListener<K extends keyof MenuEventMap>(type: K, listener: MenuListener<K>): void {
    let ls = this.listeners.get(type);
    if (ls) {
      ls = ls.filter(l => l !== listener);
    }
  }

  private fireEvent<K extends keyof MenuEventMap>(type: K, evt: MenuEventMap[K]): void {
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach((h) => {
        h(evt);
      });
    }
  }

  private findItems(): ReadonlyArray<MenuItem> {
    return Array.from(this.childNodes).flatMap((n) => {
      if (n instanceof MenuItem) {
        return [n];
      }
      return [];
    });
  }

  connectedCallback() {
    console.log("menu connected");
    const shadow = this.attachShadow({ mode: "closed" });
    const wrapper = div({}, slot({}));
    wrapper.style.position = 'absolute';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
    wrapper.style.visibility = 'hidden';
    shadow.appendChild(wrapper);
    this.dom = wrapper;    
  }

  menuItemSelected(item: MenuItem) {
    this.fireEvent('itemSelected', {menu: this, item});
    this.close();
  }

  menuItemActive(item: MenuItem) {
    this.findItems().forEach(i => {
      if (i !== item) {
        i.active = false;
      }
    });
    console.log(item);
  }

  open(refBox: Box): void {    
    if (this.dom) {
      const viewportDim = dim(window.innerWidth, window.innerHeight)
      const menuBox = Box.fromDomRect(this.dom.getBoundingClientRect());
      const placedBox = place(viewportDim, refBox, menuBox.d);
      this.dom.style.display = 'block';
      this.dom.style.top = placedBox.p.y + 'px';
      this.dom.style.left = placedBox.p.x + 'px';
      this.dom.style.visibility = 'visible';
    }
    this.installListeners();
    this.fireEvent('open', { menu: this});
  }

  close(): void {
    if (this.dom) {
      this.dom.style.display = 'none';
    }
    this.removeListeners();
    this.fireEvent('close', { menu: this});
  }

  private installListeners() {
    document.addEventListener('mousedown', this.docMouseDown, {capture: true});
    document.addEventListener('keydown', this.docKeyPress);
  }

  private removeListeners() {
    document.removeEventListener('mousedown', this.docMouseDown, {capture: true});
    document.removeEventListener('keydown', this.docKeyPress);
  }
}

export class MenuItem extends HTMLElement {

  static get observedAttributes() {
    return ["active", "mouse-over"];
  }

  private dom?: HTMLElement;

  constructor() {
    super();
  }

  // private readonly onClick = () => {
  //   const menu = this.findMenu();
  //   if (menu) {
  //     menu.f
  //   }
  // }

  get active(): boolean {
    return this.getAttribute('active') === 'true';
  }

  set active(active: boolean) {
    if (active) {
      this.setAttribute('active', "true");
    } else {
      this.removeAttribute('active');
    }
    if (active) {
      const menu = this.findMenu();
      if (menu) {
        menu.menuItemActive(this);
      }
    }
  }

  get mouseOver(): boolean {
    return this.getAttribute('mouse-over') === 'true';
  }

  set mouseOver(mouseOver: boolean) {
    this.setAttribute('mouse-over', String(mouseOver));
  }

  // set active(active: boolean) {
  //   this.setAttribute('active', String(active));
  // }

  private repaint() {
    if (this.dom) {
      this.dom.style.border = this.active ? '1px solid black' : 'none';
      this.dom.style.backgroundColor = this.mouseOver ? 'lightblue' : 'white'
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue && MenuItem.observedAttributes.indexOf(name) !== -1) {
      this.repaint();
    }
  }

  connectedCallback() {
    console.log("item connected");
    const shadow = this.attachShadow({ mode: "closed" });
    const dom = div({}, slot({}));
    shadow.appendChild(dom);
    dom.addEventListener('mouseenter', () => {
      this.mouseOver = true;
    })
    dom.addEventListener('mouseleave', () => {
      this.mouseOver = false;
    })
    dom.addEventListener('click', () => {
      const menu = this.findMenu();
      if (menu) {
        menu.menuItemSelected(this);
      }
    });
    this.dom = dom;
    this.repaint();
  }

  findMenu(): Menu | null {
    return findWithParents(this, e => e instanceof Menu) as Menu;
  }

}

export function defineCustomElements() {
  customElements.define('tp-menu', Menu);
  customElements.define('tp-menu-item', MenuItem);
}

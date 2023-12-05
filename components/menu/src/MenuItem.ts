import { div, findWithParents, slot } from './HtmlBuilder';
import { Menu } from './Menu';
import { Box } from 'tea-pop-core';

export class MenuItem extends HTMLElement {
  static get observedAttributes() {
    return ['active', 'mouse-over'];
  }

  private _dom?: HTMLElement;
  private _subMenu?: Menu;

  constructor() {
    super();
  }

  get active(): boolean {
    return this.getAttribute('active') === 'true';
  }

  set active(active: boolean) {
    if (active) {
      this.setAttribute('active', 'true');
    } else {
      this.removeAttribute('active');
    }
    if (active) {
      const menu = this.findParentMenu();
      if (menu) {
        menu.menuItemActive(this);
        this.openSubMenu();
      }
    }
  }

  get mouseOver(): boolean {
    return this.getAttribute('mouse-over') === 'true';
  }

  set mouseOver(mouseOver: boolean) {
    this.setAttribute('mouse-over', String(mouseOver));
    if (mouseOver) {
      this.openSubMenu();
    }
  }

  closeSubMenu() {
    if (this._subMenu) {
      this._subMenu.close();
    }
  }

  connectedCallback() {
    const subMenus = Array.from(this.childNodes).filter(
      (n) => n instanceof Menu,
    );
    if (subMenus.length >= 1) {
      this._subMenu = subMenus[0] as Menu;
      if (subMenus.length >= 2) {
        console.warn(
          'found several sub-menus under node. Only 1st one will be used',
          this,
          this._subMenu,
        );
      }
    }

    const shadow = this.attachShadow({ mode: 'closed' });
    const slotAnon = slot({});
    const slotSubMenu = slot({});
    slotSubMenu.setAttribute('name', 'subMenu');
    const dom = div({}, slotAnon, slotSubMenu);
    this._dom = dom;
    shadow.appendChild(dom);
    dom.addEventListener('mouseenter', (e) => {
      console.log('mouseenter', this);
      this.mouseOver = true;
    });
    dom.addEventListener('mouseleave', (e) => {
      this.mouseOver = false;
    });
    this._dom?.addEventListener('click', (e) => {
      // because menus are nested !
      e.stopPropagation();
      const menu = this.findParentMenu();
      if (menu) {
        menu.menuItemSelected(this);
      }
    });
    this.repaint();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (
      oldValue !== newValue &&
      MenuItem.observedAttributes.indexOf(name) !== -1
    ) {
      this.repaint();
    }
  }

  private repaint() {
    if (this._dom) {
      this._dom.style.border = this.active ? '1px solid black' : 'none';
      this._dom.style.backgroundColor = this.mouseOver ? 'lightblue' : 'white';
    }
  }

  private findParentMenu(): Menu | null {
    return findWithParents(this, (e) => e instanceof Menu) as Menu;
  }

  private openSubMenu() {
    const parentMenu = this.findParentMenu();
    if (parentMenu) {
      parentMenu.closeAllSubMenus();
    }
    if (this._dom && this._subMenu && parentMenu) {
      if (parentMenu) {
        parentMenu.active = false;
      }
      const r = this._dom.getBoundingClientRect();
      this._subMenu.open(Box.fromDomRect(r));
      this._subMenu.addMenuListener('close', (e) => {
        e.menu.removeAllListeners();
        const parentMenu = this.findParentMenu();
        if (parentMenu && parentMenu.isOpen) {
          parentMenu.active = true;
        }
      });
      this._subMenu.addMenuListener('itemSelected', (e) => {
        e.menu.close();
        // const parentMenu = this.findParentMenu();
        // if (parentMenu && parentMenu.isOpen) {
        //   parentMenu.menuItemSelected(e.item);
        // }
      });
    }
  }
}

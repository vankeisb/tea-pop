import { Dim, box, pos } from 'tea-pop-core';
import { Menu, MenuItem } from 'tea-pop-menu';
import * as TPM from 'tea-pop-menu';

import './style.scss';
import { ItemSeparator } from './my-items/ItemSeparator';
import { MyItemContent } from './my-items/MyItemContent';

// custom elements from tea-pop
TPM.defineCustomElements();

// sandbox elements
customElements.define('my-item-separator', ItemSeparator);
customElements.define('my-item-content', MyItemContent);

// setup sandbox UI

export type Flavor = 'programmatic' | 'declarative';

const rDecl = document.getElementById('r-decl') as HTMLInputElement;
const rProg = document.getElementById('r-prog') as HTMLInputElement;

function inputFlavor(): Flavor {
  if (rProg.checked) {
    return 'programmatic';
  }
  return 'declarative';
}

let flavor = inputFlavor();

function updateFlavor() {
  flavor = inputFlavor();
}

rDecl.addEventListener('change', updateFlavor);
rProg.addEventListener('change', updateFlavor);

const myMenu: Menu = document.getElementById('my-menu') as Menu;

myMenu.addMenuListener('open', (e) => {
  console.log('[sandbox] declarative open', e.menu);
});

myMenu.addMenuListener('itemSelected', (e) => {
  console.log('[sandbox] declarative selected', e.item, e.menu);
  myMenu.close();
});

myMenu.addMenuListener('close', (e) => {
  console.log('[sandbox] declarative closed', e.menu);
});

function getMenu(): Menu {
  switch (flavor) {
    case 'declarative': {
      return myMenu;
    }
    case 'programmatic': {
      const menu = programmaticMenu();
      menu.addMenuListener('open', (e) => {
        console.log('[sandbox] programmatic open', e.menu);
      });
      menu.addMenuListener('close', (e) => {
        console.log('[sanbox] programmatic closed');
        e.menu.remove();
      });
      menu.addMenuListener('itemSelected', (e) => {
        console.log(
          '[sanbox] programmatic selected',
          e.item,
          'in menu',
          e.menu,
        );
        menu.close();
      });
      document.body.appendChild(menu);
      return menu;
    }
  }
}

document.addEventListener(
  'contextmenu',
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    const menu = getMenu();
    menu.open(box(pos(e.clientX, e.clientY), Dim.zero));
  },
  { capture: true },
);

function programmaticMenu(): Menu {
  const menu = new Menu();
  const item1 = new MenuItem();
  item1.innerHTML = 'yalla prog';
  menu.appendChild(item1);
  const item2 = new MenuItem();
  item2.innerHTML = 'yolo prog';
  menu.appendChild(item2);
  return menu;
}

function addScroll(scroll: boolean) {
  document.getElementById('scroller').style.display = scroll ? 'block' : 'none';
}

const cbScroll = document.getElementById('cb-scroll') as HTMLInputElement;

document
  .getElementById('cb-scroll')
  .addEventListener('change', () => addScroll(cbScroll.checked));

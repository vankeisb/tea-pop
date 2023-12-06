import { Dim, box, pos } from 'tea-pop-core';
import { Menu, MenuItem } from 'tea-pop-menu';
import * as TPM from 'tea-pop-menu';

import './style.css';
import { defineMyItemContent } from './MyItemContent';

TPM.defineCustomElements();
defineMyItemContent();

const myMenu: Menu = document.getElementById('my-menu') as Menu;

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

// declarative

document.getElementById('declarative').addEventListener('contextmenu', (e) => {
  e.preventDefault();
  e.stopPropagation();
  myMenu.open(box(pos(e.clientX, e.clientY), Dim.zero));
});

myMenu.addMenuListener('itemSelected', (e) => {
  console.log('[sandbox] declarative selected', e.item, e.menu);
  myMenu.close();
});

myMenu.addMenuListener('close', (e) => {
  console.log('[sandbox] declarative closed', e.menu);
});

// programmatic

document.getElementById('programmatic').addEventListener('contextmenu', (e) => {
  e.preventDefault();
  e.stopPropagation();
  const menu = programmaticMenu();
  menu.addMenuListener('close', (e) => {
    console.log('[sanbox] programmatic closed');
    e.menu.remove();
  });
  document.body.appendChild(menu);
  menu.open(box(pos(e.clientX, e.clientY), Dim.zero));
  menu.addMenuListener('itemSelected', (e) => {
    console.log('[sanbox] programmatic selected', e.item, 'in menu', e.menu);
    menu.close();
  });
});

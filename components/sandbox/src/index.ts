import { Dim, box, pos } from 'tea-pop-core';
import { Menu, MenuItem, defineCustomElements } from 'tea-pop-menu';

defineCustomElements();

function getMyMenu(): Menu {
    return document.getElementById('my-menu') as Menu;
}

function programmaticMenu(): Menu {
    const menu = new Menu;
    const item1 = new MenuItem
    item1.innerHTML = 'yalla prog';
    menu.appendChild(item1);
    const item2 = new MenuItem
    item2.innerHTML = 'yolo prog';
    menu.appendChild(item2);
    return menu;
}

document.getElementById('declarative').addEventListener('contextmenu', e => {
    e.preventDefault();
    e.stopPropagation();
    getMyMenu().open(box(pos(e.clientX, e.clientY), Dim.zero));
});

document.getElementById('programmatic').addEventListener('contextmenu', e => {
    e.preventDefault();
    e.stopPropagation();
    const menu = programmaticMenu()
    menu.addMenuListener('close', e => e.menu.remove());
    document.body.appendChild(menu);
    menu.open(box(pos(e.clientX, e.clientY), Dim.zero));
    menu.addMenuListener('itemSelected', e => {
        console.log("selected", e.item, "in menu", e.menu);
    });
});

getMyMenu().addMenuListener('itemSelected', (e) => {
    console.log("declarative selected", e.item);
});
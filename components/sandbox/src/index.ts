/*
 * MIT License
 *
 * Copyright (c) 2023 Rémi Van Keisbelck
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

import { item, menu, Menu, MenuElement, separator } from 'tea-pop-menu';
import { box, Dim, pos } from 'tea-pop-core';
import { className, div, node, text } from 'tea-pop-menu/dist/HtmlBuilder';
import CopyIcon from '@carbon/icons/es/copy/16';
import CutIcon from '@carbon/icons/es/cut/16';
import PasteIcon from '@carbon/icons/es/paste/16';
import MLIcon from '@carbon/icons/es/machine-learning/16';
import MusicIcon from '@carbon/icons/es/music/16';
import CaretRight from '@carbon/icons/es/caret--right/16';
import { getAttributes, toSVG } from '@carbon/icon-helpers';

const ICONS = {
  cut: CutIcon,
  copy: CopyIcon,
  paste: PasteIcon,
  ml: MLIcon,
  music: MusicIcon,
};

interface MyItemData {
  readonly label: string;
  readonly icon?: string;
}

function myItem(
  label: string,
  icon?: string,
  subMenu?: () => Menu<MyItemData>,
): MenuElement<MyItemData> {
  return item({ label, icon }, subMenu);
}

const StringRenderer = (item: MenuElement<MyItemData>) => {
  switch (item.tag) {
    case 'item': {
      const { data } = item.item;
      const hasSubMenu = item.item.subMenu !== undefined;
      const { label, icon } = data;
      const iconElem = icon && ICONS[icon];
      return div(
        [className('my-item-content')],
        div(
          [className('my-icon')],
          iconElem
            ? toSVG({
                ...iconElem,
                attrs: getAttributes(iconElem.attrs),
              })
            : text(''),
        ),
        div([className('my-label')], text(label)),
        div(
          [className('my-sub-icon')],
          hasSubMenu
            ? toSVG({
                ...CaretRight,
                attrs: getAttributes(CaretRight.attrs),
              })
            : text(''),
        ),
      );
    }
    case 'separator': {
      return div([className('my-separator')]);
    }
  }
};

const myMenu: Menu<string> = menu(
  StringRenderer,
  myItem('Cut', 'cut'),
  myItem('Copy', 'copy'),
  myItem('Paste', 'paste'),
  separator,
  myItem('Music', 'music', () =>
    menu(
      StringRenderer,
      myItem('I have a sub menu too', undefined, () =>
        menu(StringRenderer, myItem('One'), myItem('two'), myItem('three')),
      ),
      myItem('Grmrmrmblblblm'),
    ),
  ),
  myItem('We all live'),
  myItem('In a yellow'),
  myItem('Submarine !!!', 'ml'),
);

myMenu.addEventListener('open', (evt) => {
  console.log("menu open", evt.menu)
});

myMenu.addEventListener('close', (evt) => {
  console.log("menu closed", evt.menu);
});

myMenu.addEventListener('itemSelected', (evt) => {
  console.log("menu item selected", evt.menu, evt.item);
});

document.addEventListener(
  'contextmenu',
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    myMenu.open(box(pos(e.clientX, e.clientY), Dim.zero));
  },
  { capture: true },
);

function addScroll(scroll: boolean) {
  document.getElementById('scroller').style.display = scroll ? 'block' : 'none';
}

const cbScroll = document.getElementById('cb-scroll') as HTMLInputElement;

document
  .getElementById('cb-scroll')
  .addEventListener('change', () => addScroll(cbScroll.checked));

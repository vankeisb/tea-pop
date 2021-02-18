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

import * as React from 'react';
import { Menu, menuId, MenuItem, menuItemId } from './Menu';
import { childMsg, Msg } from './Msg';
import { Dispatcher, map } from 'react-tea-cup';
import { ItemRenderer } from './ItemRenderer';
import { Model } from './Model';
import { stopEvent } from '../common';

export interface ViewMenuProps<T> {
  model: Model<T>;
  dispatch: Dispatcher<Msg<T>>;
  renderer: ItemRenderer<T>;
}

export function ViewMenu<T>(props: ViewMenuProps<T>): React.ReactElement {
  const { model, dispatch, renderer } = props;
  const { menu, state, uuid, windowSize } = model;
  if (uuid.type === 'Nothing') {
    return <></>;
  }
  if (windowSize.type === 'Nothing') {
    return <></>;
  }

  const renderItems = () =>
    menu.elems.map((element, index) => {
      switch (element.tag) {
        case 'item': {
          return (
            <ViewMenuItem
              key={`item-${index}`}
              uuid={uuid.value}
              itemIndex={index}
              menu={menu}
              item={element}
              {...props}
            />
          );
        }
        case 'separator': {
          return <div key={`sep-${index}`} className="tm-separator" />;
        }
      }
    });

  switch (state.tag) {
    case 'placing': {
      const { refBox } = state;
      return (
        <div
          className="tm-placer"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            overflow: 'hidden',
          }}
          onContextMenu={stopEvent}
        >
          <div
            className="tm"
            id={menuId(uuid.value)}
            style={{
              position: 'absolute',
              top: refBox.p.y,
              left: refBox.p.x,
              visibility: 'hidden',
            }}
            onContextMenu={stopEvent}
          >
            {renderItems()}
          </div>
        </div>
      );
    }
    case 'open': {
      const { box } = state;
      const { p, d } = box;
      return (
        <>
          <div
            className="tm"
            id={menuId(uuid.value)}
            style={{
              position: 'absolute',
              top: p.y,
              left: p.x,
              width: d.w,
              height: d.h,
            }}
            onContextMenu={stopEvent}
          >
            {renderItems()}
          </div>
          {model.child
            .map((child) => (
              <ViewMenu
                model={child}
                dispatch={map(dispatch, childMsg)}
                renderer={renderer}
              />
            ))
            .withDefaultSupply(() => (
              <></>
            ))}
        </>
      );
    }
  }
}

export interface ViewMenuItemProps<T> {
  uuid: string;
  itemIndex: number;
  menu: Menu<T>;
  item: MenuItem<T>;
  dispatch: Dispatcher<Msg<T>>;
  renderer: ItemRenderer<T>;
}

export function ViewMenuItem<T>(
  props: ViewMenuItemProps<T>,
): React.ReactElement {
  const { menu, item, renderer, dispatch, uuid, itemIndex } = props;
  const selected = menu.isSelected(item);
  return (
    <div
      id={menuItemId(uuid, itemIndex)}
      onMouseMove={() => dispatch({ tag: 'mouse-move', item, itemIndex })}
      onMouseLeave={() => dispatch({ tag: 'mouse-leave', item, itemIndex })}
      onClick={() => {
        dispatch({ tag: 'item-clicked', item });
      }}
    >
      {renderer({
        data: item.userData,
        active: selected,
        hasSubMenu: item.subMenu.isJust(),
      })}
    </div>
  );
}

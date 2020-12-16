import * as React from 'react';
import {MenuItem} from "./Menu";
import {Msg} from "./Msg";
import {Dispatcher} from "react-tea-cup";
import {ItemRenderer} from "./ItemRenderer";
import {menuId, Model} from "./Model";
import {stopEvent} from "../tea-popover/StopEvent";
import {adjustPopover} from "../tea-popover/Popover";

export interface ViewMenuProps<T> {
  model: Model<T>;
  dispatch: Dispatcher<Msg>;
  renderer: ItemRenderer<T>;
}

export function ViewMenu<T>(props: ViewMenuProps<T>) {
  const {model} = props;
  const {menu, state, uuid, windowSize} = model;
  if (uuid.type === 'Nothing') {
    return <></>;
  }
  if (windowSize.type === 'Nothing') {
    return <></>;
  }

  const renderItems = () => menu.items.map((item, index) => {
      switch (item.tag) {
        case "item": {
          return (
              <ViewMenuItem key={`item-${index}`} item={item} {...props} />
          )
        }
        case "separator": {
          return (
              <div key={`sep-${index}`} className="tea-menu--separator"/>
          )
        }
      }
    });

  switch (state.tag) {
    case "closed":
      return <></>;
    case "placing": {
      const { position } = state;
      return (
          <div
              className="tea-menu-placer"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                overflow: "hidden",
              }}
              onContextMenu={stopEvent}
          >
            <div
                className="tea-menu"
                id={menuId(uuid.value)}
                style={{
                  position: "absolute",
                  top: position.y,
                  left: position.x,
                  visibility: "hidden",
                }}
                onContextMenu={stopEvent}
            >
              {renderItems()}
            </div>
          </div>
      )
    }
    case "open": {
      const { box } = state;
      const { p, d } = box;
      return (
          <div
              className="tea-menu"
              id={menuId(uuid.value)}
              style={{
                position: "absolute",
                top: p.y,
                left: p.x,
                width: d.w,
                height: d.h
              }}
              onContextMenu={stopEvent}
          >
            {renderItems()}
          </div>
      )
    }
  }
}

export interface ViewMenuItemProps<T> {
  item: MenuItem<T>;
  dispatch: Dispatcher<Msg>;
  renderer: ItemRenderer<T>;
}

export function ViewMenuItem<T>(props: ViewMenuItemProps<T>) {
  const {item, renderer} = props;
  return (
      <div className="tea-menu--item">
        {renderer(item.userData)}
      </div>
  )
}

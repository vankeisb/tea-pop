import * as React from 'react';
import {MenuItem} from "./Menu";
import {Msg} from "./Msg";
import {Dispatcher} from "react-tea-cup";
import {ItemRenderer} from "./ItemRenderer";
import {Model} from "./Model";

export interface ViewMenuProps<T> {
  model: Model<T>;
  dispatch: Dispatcher<Msg>;
  renderer: ItemRenderer<T>;
}

export function ViewMenu<T>(props: ViewMenuProps<T>) {
  const { model } = props;
  const { menu, openAt } = model;
  return openAt
      .map(posAndDim => (
          <div className="tea-menu">
            {menu.items.map(i => {
              switch (i.tag) {
                case "item": {
                  return (
                      <ViewMenuItem item={i} {...props} />
                  )
                }
                case "separator": {
                  return (
                      <div className="tea-menu--separator"/>
                  )
                }
              }
            })}
          </div>
      ))
      .withDefaultSupply(() => <></>);

}

export interface ViewMenuItemProps<T> {
  item: MenuItem<T>;
  dispatch: Dispatcher<Msg>;
  renderer: ItemRenderer<T>;
}

export function ViewMenuItem<T>(props: ViewMenuItemProps<T>) {
  const { item, renderer } = props;
  return (
      <div className="tea-menu--item">
        {renderer(item.userData)}
      </div>
  )
}

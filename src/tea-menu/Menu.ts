import {just, Maybe, maybeOf, nothing} from "react-tea-cup";

export interface Menu<T> {
  readonly items: ReadonlyArray<MenuElement<T>>;
}

export type MenuElement<T>
    = MenuItem<T>
    | MenuSeparator

export interface MenuItem<T> {
  tag: 'item'
  readonly userData: T
  readonly subMenu: Maybe<Menu<T>>
}

export interface MenuSeparator {
  tag: 'separator'
}

export function menu<T>(items: ReadonlyArray<MenuElement<T>>): Menu<T> {
  return {
    items,
  }
}

export function item<T>(userData: T, subMenu?: Menu<T>): MenuItem<T> {
  return {
    tag: 'item',
    userData,
    subMenu: maybeOf(subMenu)
  }
}

export const separator: MenuSeparator = {
  tag: "separator"
}

export function indexOfItem<T>(menu: Menu<T>, item: MenuItem<T>): number {
  return getItems(menu).indexOf(item);
}

export function getItems<T>(menu: Menu<T>): ReadonlyArray<MenuItem<T>> {
  const res: Array<MenuItem<T>> = [];
  menu.items.forEach(item => {
    if (item.tag === "item") {
      res.push(item)
    }
  })
  return res;
}

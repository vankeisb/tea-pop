import {ListWithSelection, Maybe, maybeOf} from "react-tea-cup";

export class Menu<T> {
  constructor(private readonly elements: ListWithSelection<MenuElement<T>>) {}

  selectItem(item: MenuItem<T>): Menu<T> {
    return new Menu(this.elements.select(e => e === item));
  }

  get elems(): ReadonlyArray<MenuElement<T>> {
    return this.elements.toArray();
  }

  isSelected(item: MenuItem<T>): boolean {
    return this.elements.isSelected(item)
  }
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
  return new Menu(ListWithSelection.fromArray(items));
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

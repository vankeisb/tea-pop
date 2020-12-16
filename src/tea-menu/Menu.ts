import {just, ListWithSelection, Maybe, maybeOf, nothing, Task} from "react-tea-cup";

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

  private findNextItemIndex(start: number): Maybe<number> {
    const elems = this.elems;
    const s = start === elems.length - 1 ? 0 : start + 1;
    for (let i = s; i < elems.length; i++) {
      if (elems[i].tag === "item") {
        return just(i);
      }
    }
    return nothing;
  }

  private findPreviousItemIndex(start: number): Maybe<number> {
    const elems = this.elems;
    const s = start === 0 ? elems.length - 1 : start - 1;
    for (let i = s; i >= 0; i--) {
      if (elems[i].tag === "item") {
        return just(i);
      }
    }
    return nothing;
  }

  moveSelection(down: boolean): Menu<T> {
    return this.elements.getSelectedIndex()
        .map(selectedIndex => {
          const mbNextIndex = down
              ? this.findNextItemIndex(selectedIndex)
              : this.findPreviousItemIndex(selectedIndex);
          return mbNextIndex
              .map(nextIndex => new Menu(this.elements.selectIndex(nextIndex)))
              .withDefault(this)
        })
        .withDefaultSupply(() => {
          return new Menu(
              this.elements.selectIndex(
                  down ? 0 : this.elements.length() - 1
              )
          )
        });
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

export function menuId(uuid: string): string {
  return `tm-${btoa(uuid)}`;
}

export function menuItemId(menuId: string, itemIndex: number): string {
  return `tm-item-${menuId}-${itemIndex}`;
}

export function menuTask(uuid: string): Task<Error, HTMLElement> {
  return byId(menuId(uuid));
}

export function menuItemTask(menuId: string, itemIndex: number): Task<Error, HTMLElement> {
  return byId(menuItemId(menuId, itemIndex));
}

function byId(id: string): Task<Error, HTMLElement> {
  return Task.fromLambda(() => {
    const e = document.getElementById(id);
    if (e === null) {
      throw new Error("element not found with id:" + id);
    }
    return e;
  })
}

import {getItems, Menu, MenuItem} from "./Menu";
import {Maybe} from "react-tea-cup";

export type MenuPath = ReadonlyArray<number>;

export const emptyMenuPath: MenuPath = [];

export function menuPath<T>(menu: Menu<T>, item: MenuItem<T>): MenuPath {
  const items = getItems(menu);
  for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    const curItem = items[itemIndex];
    if (curItem === item) {
      return [itemIndex];
    }
  }
  return [];
}

export function resolvePath<T>(menu: Menu<T>, path: MenuPath): ReadonlyArray<MenuItem<T>> {
  if (path.length === 0) {
    return [];
  }
  if (path.length === 1) {
    const pathIndex = path[0];
    const items = getItems(menu);
    for (let index = 0 ; index < items.length ; index++) {
      const item = items[pathIndex];
      if (item === undefined) {
        return [];
      }
      return [item];
    }
  }
  return [];
}

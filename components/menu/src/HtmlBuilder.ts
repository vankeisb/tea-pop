export type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;

type NodeBuilder<K extends keyof HTMLElementTagNameMap> = (
  a: DeepPartial<HTMLElementTagNameMap[K]>,
  ...c: Node[]
) => HTMLElementTagNameMap[K];

export function node<K extends keyof HTMLElementTagNameMap>(
  tag: K,
): NodeBuilder<K> {
  return (a: DeepPartial<HTMLElementTagNameMap[K]>, ...c: Node[]) => {
    const n: HTMLElementTagNameMap[K] = document.createElement(tag);
    c.forEach((child) => n.appendChild(child));
    const keys = Object.keys(a) as Array<keyof typeof a>;
    keys.forEach((k) => setProperty(n, k, getProperty(a, k)));
    return n;
  };
}

function getProperty<T, K extends keyof T>(o: T, key: K): T[K] {
  return o[key];
}

function setProperty<T, K extends keyof T>(o: T, key: K, value: T[K]): void {
  o[key] = value;
}

export const div = node('div');
export const span = node('span');
export const a = node('a');
export const p = node('p');
export const h1 = node('h1');
export const input = node('input');
export const label = node('label');
export const slot = node('slot');
export const style = node('style');

export function text(s: string): Text {
  return document.createTextNode(s);
}

export function empty(e: Node) {
  while (e.firstChild) {
    e.removeChild(e.firstChild);
  }
}

export function px(n: number): string {
  return n + 'px';
}

export function findWithParents(elem: HTMLElement | null, matcher: (p:HTMLElement) => boolean): HTMLElement | null {
  if (elem === null) {
    return null;
  } else {
    if (matcher(elem)) {
      return elem;
    } else {
      return findWithParents(elem.parentElement, matcher);
    }
  }
}

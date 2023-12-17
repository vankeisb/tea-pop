export type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;

export type Attr<
  K extends keyof HTMLElementTagNameMap,
  N extends HTMLElementTagNameMap[K]
> = (n: N) => void;

export function style<
  K extends keyof HTMLElementTagNameMap,
  N extends HTMLElementTagNameMap[K]
>(s: Partial<CSSStyleDeclaration>): Attr<K, N> {
  return (n) => {
    const keys = Object.keys(s);
    keys.forEach((k) => {
      // @ts-ignore
      n.style[k] = s[k];
    });
  };
}

export function attr<
  K extends keyof HTMLElementTagNameMap,
  N extends HTMLElementTagNameMap[K],
  A extends keyof N
>(name: A, value: N[A]): Attr<K, N> {
  return (n) => {
    n[name] = value;
  };
}

export function className<
  K extends keyof HTMLElementTagNameMap,
  N extends HTMLElementTagNameMap[K]
>(className: string): Attr<K, N> {
  return (n) => {
    n.classList.add(className);
  };
}

type NodeBuilder<
  K extends keyof HTMLElementTagNameMap,
  N extends HTMLElementTagNameMap[K]
> = (attrs: Attr<K, N>[], ...c: Node[]) => N;

export function node<K extends keyof HTMLElementTagNameMap>(
  tag: K,
): NodeBuilder<K, HTMLElementTagNameMap[K]> {
  return (attrs: Attr<K, HTMLElementTagNameMap[K]>[], ...children: Node[]) => {
    const n = document.createElement(tag);
    children.forEach((child) => n.appendChild(child));
    attrs.forEach((attr) => {
      attr(n);
    });
    return n;
  };
}

export const div = node('div');
export const span = node('span');
export const a = node('a');
export const p = node('p');
export const h1 = node('h1');
export const input = node('input');
export const slot = node('slot');

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

export function findWithParents(
  elem: HTMLElement | null,
  matcher: (p: HTMLElement) => boolean,
): HTMLElement | null {
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

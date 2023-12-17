import {item, menu, Menu, MenuElement, MenuItem, separator} from "tea-pop-menu";
import {box, Dim, pos} from "tea-pop-core";
import {className, div, node, text} from "tea-pop-menu/dist/HtmlBuilder";

const StringRenderer = (s: MenuElement<string>) => {
    switch (s.tag) {
        case "item": {
            return div([className('my-item')], text(s.item.data));
        }
        case "separator": {
            return node('hr')([]);
        }
    }
}

const myMenu: Menu<string> = menu(
    StringRenderer,
    item("Foo"),
    item(
        "Bar",
        () => menu(
            StringRenderer,
            item("Yalla"),
            item("This is a test"),
            item("I have a sub menu too", () => menu(
                StringRenderer,
                item("One"),
                item("two"),
                item("three")
            )),
            item("Grmrmrmblblblm")
        )),
    item("Baz"),
    separator,
    item("This is funky")
);

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

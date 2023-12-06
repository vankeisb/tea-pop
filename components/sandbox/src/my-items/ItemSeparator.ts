import { div, style } from 'tea-pop-menu/dist/HtmlBuilder';

export class ItemSeparator extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: 'closed' }).appendChild(
      div([
        style({
          backgroundColor: 'lightgray',
          height: '1px',
        }),
      ]),
    );
  }
}

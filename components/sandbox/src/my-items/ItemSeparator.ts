import { attr, className, div, node } from 'tea-pop-menu/dist/HtmlBuilder';

export class ItemSeparator extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    const link = node('link')([
      attr('rel', 'stylesheet'),
      attr('href', 'style.css'),
    ]);
    shadow.appendChild(link);
    shadow.appendChild(div([className('my-separator')]));
  }
}

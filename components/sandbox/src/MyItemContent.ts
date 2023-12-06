import CopyIcon from '@carbon/icons/es/copy/16';
import CutIcon from '@carbon/icons/es/cut/16';
import PasteIcon from '@carbon/icons/es/paste/16';
import { getAttributes, toSVG } from '@carbon/icon-helpers';
import { div, style, text } from 'tea-pop-menu/dist/HtmlBuilder';

type MenuAction = 'copy' | 'cut' | 'paste';

interface MyItemData {
  readonly label: string;
  readonly icon: any;
}

function getItemData(action: MenuAction): MyItemData {
  switch (action) {
    case 'copy': {
      return {
        label: 'Copy',
        icon: CopyIcon,
      };
    }
    case 'cut': {
      return {
        label: 'Cut',
        icon: CutIcon,
      };
    }
    case 'paste': {
      return {
        label: 'Paste',
        icon: PasteIcon,
      };
    }
  }
}

function getAction(action: string): MenuAction | undefined {
  switch (action) {
    case 'copy':
    case 'cut':
    case 'paste':
      return action;
    default:
      return undefined;
  }
}

export class MyItemContent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    const action = getAction(this.getAttribute('action') ?? '');
    if (action !== undefined) {
      const itemData = getItemData(action);
      const wrapper = div(
        [
          style({
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            height: '24px',
          }),
        ],
        div(
          [
            style({
              width: '16px',
              paddingRight: '8px',
            }),
          ],
          toSVG({
            ...itemData.icon,
            attrs: getAttributes(itemData.icon.attrs),
          }),
        ),
        div(
          [
            style({
              paddingRight: '8px',
            }),
          ],
          text(itemData.label),
        ),
      );
      shadow.appendChild(wrapper);
    }
  }
}

export function defineMyItemContent() {
  customElements.define('my-item-content', MyItemContent);
}

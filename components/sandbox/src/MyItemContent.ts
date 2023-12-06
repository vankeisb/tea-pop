import CopyIcon from '@carbon/icons/es/copy/16';
import CutIcon from '@carbon/icons/es/cut/16';
import PasteIcon from '@carbon/icons/es/paste/16';
import { getAttributes, toSVG } from '@carbon/icon-helpers';
import { div, text } from 'tea-pop-menu/dist/HtmlBuilder';

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
        {},
        div(
          {},
          toSVG({
            ...itemData.icon,
            attrs: getAttributes(itemData.icon.attrs),
          }),
        ),
        div({}, text(itemData.label)),
      );
      wrapper.style.display = 'flex';
      wrapper.style.flexDirection = 'row';
      wrapper.style.alignItems = 'center';
      shadow.appendChild(wrapper);
    }
  }
}

export function defineMyItemContent() {
  customElements.define('my-item-content', MyItemContent);
}

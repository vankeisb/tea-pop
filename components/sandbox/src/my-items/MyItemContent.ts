import { div, slot, style, text } from 'tea-pop-menu/dist/HtmlBuilder';

import CaretRight from '@carbon/icons/es/caret--right/16';
import { getAttributes, toSVG } from '@carbon/icon-helpers';

import CopyIcon from '@carbon/icons/es/copy/16';
import CutIcon from '@carbon/icons/es/cut/16';
import PasteIcon from '@carbon/icons/es/paste/16';
import MLIcon from '@carbon/icons/es/machine-learning/16';
import MusicIcon from '@carbon/icons/es/music/16';

const ICONS = {
  cut: CutIcon,
  copy: CopyIcon,
  paste: PasteIcon,
  ml: MLIcon,
  music: MusicIcon,
};

export class MyItemContent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const iconStr = this.getAttribute('icon');
    const icon = iconStr && ICONS[iconStr];
    const iconNode = icon
      ? toSVG({
          ...icon,
          attrs: getAttributes(icon.attrs),
        })
      : text('');

    const hasSubMenu = this.getAttribute('sub-menu') === 'true';
    const subMenuNode = hasSubMenu
      ? toSVG({
          ...CaretRight,
          attrs: getAttributes(CaretRight.attrs),
        })
      : text('');

    this.attachShadow({ mode: 'closed' }).appendChild(
      div(
        [
          style({
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            paddingTop: '4px',
            paddingBottom: '4px',
            paddingLeft: '4px',
          }),
        ],
        div(
          [
            style({
              width: '16px',
              paddingRight: '8px',
            }),
          ],
          iconNode,
        ),
        div(
          [
            style({
              paddingRight: '16px',
            }),
          ],
          slot([], text('no content')),
        ),
        div(
          [
            style({
              position: 'absolute',
              width: '16px',
              right: '0',
            }),
          ],
          subMenuNode,
        ),
      ),
    );
  }
}

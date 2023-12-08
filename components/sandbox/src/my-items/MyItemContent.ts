import {
  className,
  div,
  findWithParents,
  node,
  slot,
  style,
  text,
} from 'tea-pop-menu/dist/HtmlBuilder';

import CaretRight from '@carbon/icons/es/caret--right/16';
import { getAttributes, toSVG } from '@carbon/icon-helpers';

import CopyIcon from '@carbon/icons/es/copy/16';
import CutIcon from '@carbon/icons/es/cut/16';
import PasteIcon from '@carbon/icons/es/paste/16';
import MLIcon from '@carbon/icons/es/machine-learning/16';
import MusicIcon from '@carbon/icons/es/music/16';
import { MenuItem } from 'tea-pop-menu';

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

  private _dom?: HTMLElement;
  private _parentItem?: MenuItem;

  private onMouseEnter = () => {
    if (this._dom) {
      this._dom.classList.add('highlighted');
    }
  };
  private onMouseLeave = () => {
    if (this._dom) {
      this._dom.classList.remove('highlighted');
    }
  };
  private onFocus = () => {
    if (this._dom) {
      this._dom.classList.add('focused');
    }
  };
  private onBlur = () => {
    if (this._dom) {
      this._dom.classList.remove('focused');
    }
  };

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

    this._dom = div(
      [className('my-content-wrapper')],
      div(
        [
          style({
            display: 'flex',
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
            display: 'flex',
          }),
        ],
        subMenuNode,
      ),
    );

    const styleNode = node('style')(
      [],
      text(`
        .my-content-wrapper {
          position: relative;
          display: flex;
          flex-direction: row;
          padding-top: 4px;
          padding-bottom: 4px;
          padding-left: 4px;
          border: 1px solid white;
          box-sizing: border-box;
          align-items: center;
        }
        
        .highlighted {
          background-color: lightblue;
        }
        
        .focused {
          border: 1px solid black;
        }
    `),
    );

    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.appendChild(styleNode);
    shadow.appendChild(this._dom);

    this._parentItem = this.findParentItem();
    if (this._parentItem) {
      this._parentItem.addMenuItemListener('mouseenter', this.onMouseEnter);
      this._parentItem.addMenuItemListener('mouseleave', this.onMouseLeave);
      this._parentItem.addMenuItemListener('focus', this.onFocus);
      this._parentItem.addMenuItemListener('blur', this.onBlur);
    }
  }

  disconnectedCallback() {
    if (this._parentItem) {
      this._parentItem.removeMenuItemListener('mouseenter', this.onMouseEnter);
      this._parentItem.removeMenuItemListener('mouseleave', this.onMouseLeave);
      this._parentItem.removeMenuItemListener('focus', this.onFocus);
      this._parentItem.removeMenuItemListener('blur', this.onBlur);
    }
  }

  private findParentItem(): MenuItem | null {
    return findWithParents(this, (e) => {
      return e instanceof MenuItem;
    }) as MenuItem;
  }
}

import {
  attr,
  className,
  div,
  findWithParents,
  node,
  slot,
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
    const hasSubMenu = this.getAttribute('sub-menu') === 'true';

    this._dom = div(
      [className('my-content-wrapper')],
      div(
        [className('my-icon')],
        icon
          ? toSVG({
              ...icon,
              attrs: getAttributes(icon.attrs),
            })
          : text(''),
      ),
      div([className('my-label')], slot([], text('no content'))),
      div(
        [className('my-sub')],
        hasSubMenu
          ? toSVG({
              ...CaretRight,
              attrs: getAttributes(CaretRight.attrs),
            })
          : text(''),
      ),
    );

    const shadow = this.attachShadow({ mode: 'closed' });

    const link = node('link')([
      attr('rel', 'stylesheet'),
      attr('href', 'style.css'),
    ]);
    shadow.appendChild(link);
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

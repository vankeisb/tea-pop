import { Cmd, noCmd, Sub } from 'react-tea-cup';
import * as React from 'react';
import { Renderer } from 'tea-pop-dropdown/dist/DropDown';
import { DropDownModel } from 'tea-pop-dropdown';

export interface Model {
  readonly counter: 0;
  // readonly ddModel: DropDownModel;
}

export type Msg = string;

export function mouseEnterRef(model: Model): [Model, Cmd<Msg>] {
  throw new Error('TODO');
}

export function mouseLeaveRef(model: Model): [Model, Cmd<Msg>] {
  throw new Error('TODO');
}

export function mouseEnterTooltip(model: Model): [Model, Cmd<Msg>] {
  throw new Error('TODO');
}

export function mouseLeaveTooltip(model: Model): [Model, Cmd<Msg>] {
  throw new Error('TODO');
}

export function init(): [Model, Cmd<Msg>] {
  return noCmd({
    counter: 0,
  });
}

export function update(msg: Msg, model: Model): [Model, Cmd<Msg>] {
  return noCmd(model);
}

export function subscriptions(model: Model): Sub<Msg> {
  return Sub.none();
}

export interface TooltipProps {
  readonly renderer: Renderer;
  readonly model: Model;
}
//
// export function ViewTooltip(props: TooltipProps) {
//   return <ViewDropDown >;
// }

import { Cmd, noCmd, Sub } from 'tea-cup-core';
import * as React from 'react';

export type Renderer = () => React.ReactNode;

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

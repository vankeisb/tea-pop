/*
 * MIT License
 *
 * Copyright (c) 2020 Rémi Van Keisbelck
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import * as React from 'react';
import { Dispatcher } from 'tea-cup-fp';
import { ViewDropDown } from 'tea-pop-dropdown';
import { Renderer } from './Renderer';
import { comboHtmlId, comboItemHtmlId, Model } from './Model';
import { Msg } from './Msg';

export interface ViewComboBoxProps<T> {
  model: Model<T>;
  dispatch: Dispatcher<Msg<T>>;
  renderer: Renderer<T>;
}

export function ViewComboBox<T>(
  props: ViewComboBoxProps<T>,
): React.ReactElement {
  const { model, dispatch, renderer } = props;
  const { value } = model;
  return model.uuid
    .map((uuid) => (
      <div className="tp-combobox">
        {renderer.renderInput({
          id: comboHtmlId(uuid),
          value,
          onChange: (value) =>
            dispatch({
              tag: 'input-value-changed',
              value,
            }),
          onBlur: () =>
            dispatch({
              tag: 'input-blurred',
            }),
          onKeyDown: (key) =>
            dispatch({
              tag: 'input-key-down',
              key,
            }),
          onTriggerClick: () =>
            dispatch({
              tag: 'trigger-clicked',
            }),
        })}
        {model.ddModel
          .map((ddModel) => (
            <ViewDropDown
              model={ddModel}
              renderer={() => {
                const renderItem = (item: T, index: number) => {
                  const selected = model.items
                    .andThen((r) => r.toMaybe())
                    .andThen((l) => l.getSelectedIndex())
                    .map((selIndex) => selIndex === index)
                    .withDefault(false);
                  const classes = ['tp-combobox-item'].concat(
                    selected ? ['tp-selected'] : [],
                  );
                  return (
                    <div
                      id={comboItemHtmlId(uuid, index)}
                      key={index}
                      className={classes.join(' ')}
                      onMouseDown={() =>
                        dispatch({
                          tag: 'item-clicked',
                          item,
                        })
                      }
                    >
                      {renderer.renderItem({
                        item,
                        index,
                        value,
                      })}
                    </div>
                  );
                };

                return (
                  <div className="tp-combobox-items">
                    {model.items
                      .map((res) =>
                        res.match(
                          (items) =>
                            items.length() === 0 ? (
                              <div className="tp-combobox-no-matches">
                                {renderer.renderNoMatches()}
                              </div>
                            ) : (
                              <>{items.toArray().map(renderItem)}</>
                            ),
                          (err) => {
                            return (
                              <div className="tp-combo-error">
                                {err.message}
                              </div>
                            );
                          },
                        ),
                      )
                      .withDefaultSupply(() => {
                        // we are loading items...
                        return (
                          <div className="tp-combobox-loading">
                            {renderer.renderLoading()}
                          </div>
                        );
                      })}
                  </div>
                );
              }}
            />
          ))
          .withDefault(<></>)}
      </div>
    ))
    .withDefault(<></>);
}

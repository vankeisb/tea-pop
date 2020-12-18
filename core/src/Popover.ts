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

import {box, Box} from "./Box";
import {dim, Dim} from "./Dim";
import {pos} from "./Pos";

export function adjustPopover(viewport: Dim, elem: Box): Box {

  // display above or below and shrink size if necessary

  const {x, y} = elem.p;
  const {h, w} = elem.d;
  const { h:vh, w:vw } = viewport;

  let newY = y;
  let newH = h;
  const overflowDown = (y + h) - vh;
  if (overflowDown > 0) {
    // would overflow the bottom, check if we have enough space to move up
    if (y > overflowDown) {
      // enough space, move pos up
      newY = y - overflowDown;
    } else {
      // not enough space, shrink the box to the viewport's height
      newY = 0;
      newH = vh;
    }
  }

  let newX = x;
  let newW = w;
  const overflowRight = (x + w) - vw;
  if (overflowRight > 0) {
    // would overflow on the right, check if we have enough space to move left
    if (x > overflowRight) {
      // enough space, move left
      newX = x - overflowRight;
    } else {
      newX = 0;
      newW = vw;
    }
  }

  return box(pos(newX, newY), dim(newW, newH));
}

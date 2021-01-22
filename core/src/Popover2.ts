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

import { box, Box } from './Box';
import { dim, Dim } from './Dim';
import { Pos, pos } from './Pos';

export function place(viewport: Dim, refBox: Box, elem: Dim): Box {
  const pX = place1DEnd(viewport.w, refBox.p.x, refBox.d.w, elem.w);
  const pY = place1DStart(viewport.h, refBox.p.y, refBox.d.h, elem.h);
  return box(pos(pX.x, pY.x), dim(pX.w, pY.w));
}

interface Placed1D {
  readonly x: number;
  readonly w: number;
}

function place1DEnd(
  viewportW: number,
  refX: number,
  refW: number,
  elemW: number,
): Placed1D {
  if (elemW > viewportW) {
    return { x: 0, w: viewportW };
  }
  if (refX + refW + elemW > viewportW) {
    // not enough space after, try before
    if (elemW < refX) {
      // ok, prepend
      return { x: refX - elemW, w: elemW };
    } else {
      // not enough space before or after, we have to translate and/or expand !
      if (elemW < viewportW) {
        // can't append or prepend, but no need to shrink... translate only
        const delta = refX + refW + elemW - viewportW;
        return { x: refX + refW - delta, w: elemW };
      }
      return { x: 0, w: 10 };
    }
  } else {
    // enough space to append
    return { x: refX + refW, w: elemW };
  }
}

function place1DStart(
  viewportW: number,
  refX: number,
  refW: number,
  elemW: number,
): Placed1D {
  if (elemW > viewportW) {
    return { x: 0, w: viewportW };
  }
  if (refX + elemW > viewportW) {
    // not enough space after, try before
    if (elemW < refX + refW) {
      // ok, prepend
      return { x: refX + refW - elemW, w: elemW };
    } else {
      // not enough space before or after, we have to translate and/or expand !
      if (elemW < viewportW) {
        console.log('shrink');
        // can't append or prepend, but no need to shrink... translate only
        const delta = refX + refW + elemW - viewportW;
        return { x: refX + refW - delta, w: elemW };
      }
      return { x: 0, w: 10 };
    }
  } else {
    // enough space to append
    return { x: refX, w: elemW };
  }
}

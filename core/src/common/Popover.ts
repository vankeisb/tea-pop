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
import { pos } from './Pos';

export function place(viewport: Dim, refBox: Box, elem: Dim): Box {
  const pX = place1DEnd(viewport.w, refBox.p.x, refBox.d.w, elem.w);
  const pY = place1DStart(viewport.h, refBox.p.y, refBox.d.h, elem.h);
  return box(pos(pX.offset, pY.offset), dim(pX.len, pY.len));
}

export function placeCombo(viewport: Dim, refBox: Box, elem: Dim): Box {
  const pX = place1DStart(viewport.w, refBox.p.x, refBox.d.w, elem.w);
  const pY = placeComboY(viewport.h, refBox.p.y, refBox.d.h, elem.h);
  return box(pos(pX.offset, pY.offset), dim(pX.len, pY.len));
}

interface Placed1D {
  readonly offset: number;
  readonly len: number;
}

export function place1DEnd(
  viewportW: number,
  refX: number,
  refW: number,
  elemW: number,
): Placed1D {
  if (refX + refW + elemW > viewportW) {
    // not enough space after, try before
    if (elemW < refX) {
      // ok, prepend
      return { offset: refX - elemW, len: elemW };
    } else {
      // not enough space before or after, we have to translate and/or expand !
      if (elemW < viewportW) {
        // can't append or prepend, but no need to shrink... translate only
        const delta = refX + refW + elemW - viewportW;
        return { offset: refX + refW - delta, len: elemW };
      }
      return { offset: 0, len: viewportW };
    }
  } else {
    // enough space to append
    return { offset: refX + refW, len: elemW };
  }
}

export function place1DStart(
  viewportW: number,
  refX: number,
  refW: number,
  elemW: number,
): Placed1D {
  if (elemW > viewportW) {
    return { offset: 0, len: viewportW };
  }
  if (refX + elemW > viewportW) {
    // not enough space after, try before
    if (elemW < refX + refW) {
      // ok, prepend
      return { offset: refX + refW - elemW, len: elemW };
    } else {
      // not enough space before or after, we have to translate and/or expand !
      if (elemW < viewportW) {
        // can't append or prepend, but no need to shrink... translate only
        const delta = refX + refW + elemW - viewportW;
        return { offset: refX + refW - delta, len: elemW };
      }
      return { offset: 0, len: 10 };
    }
  } else {
    // enough space to append
    return { offset: refX, len: elemW };
  }
}

function placeComboY(
  viewportW: number,
  refX: number,
  refW: number,
  elemW: number,
): Placed1D {
  const elemEnd = refX + refW;
  const spaceBefore = refX;
  const spaceAfter = viewportW - elemEnd;
  if (elemW < spaceAfter) {
    // enough space after, append
    return { offset: elemEnd, len: elemW };
  } else if (elemW < spaceBefore) {
    // enough space before, append
    return { offset: refX - elemW, len: elemW };
  } else {
    // not enough space, need to shrink
    // use the most space
    if (spaceBefore > spaceAfter) {
      // place before
      return { offset: 0, len: spaceBefore };
    } else {
      return { offset: elemEnd, len: spaceAfter };
    }
  }
}

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

import { dim, Dim } from './Dim';
import { box, Box } from './Box';
import { placeCombo, placeComboSliding } from './Place';
import { pos, Pos } from './Pos';

describe('place combo box sliding', () => {
  const viewport: Dim = dim(100);
  const d55 = dim(55);
  const box33 = box(Pos.origin, dim(33));
  const box55 = box(Pos.origin, d55);
  const boxStuckRight = box55.translate(pos(45, 10 + 33));

  describe('standard', () => {
    const place = (refBox: Box, elem: Dim) =>
      placeCombo(viewport, refBox, elem);

    test('top left aligns left', () => {
      expect(place(box33.translate(pos(10, 10)), d55)).toEqual(
        box55.translate(pos(10, 10 + 33)),
      );
    });

    test('left not clipping aligns left', () => {
      expect(place(box33.translate(pos(45, 10)), d55)).toEqual(
        box55.translate(pos(45, 10 + 33)),
      );
    });

    test('right (clipping) aligns right', () => {
      expect(place(box33.translate(pos(60, 10)), d55)).toEqual(
        box(pos(60 + 33 - 55, 10 + 33), d55),
      );
    });

    test('fully to the right aligns right', () => {
      expect(place(box33.translate(pos(67, 10)), d55)).toEqual(boxStuckRight);
    });
  });

  describe('sliding', () => {
    const place = (refBox: Box, elem: Dim) =>
      placeComboSliding(viewport, refBox, elem);

    test('top left aligns left', () => {
      expect(place(box33.translate(pos(10, 10)), d55)).toEqual(
        box55.translate(pos(10, 10 + 33)),
      );
    });

    test('left not clipping aligns left', () => {
      expect(place(box33.translate(pos(45, 10)), d55)).toEqual(
        box55.translate(pos(45, 10 + 33)),
      );
    });

    test('clips to the right slides', () => {
      expect(place(box33.translate(pos(50, 10)), d55)).toEqual(boxStuckRight);
      expect(place(box33.translate(pos(60, 10)), d55)).toEqual(boxStuckRight);
    });

    test('fully to the right aligns right', () => {
      expect(place(box33.translate(pos(67, 10)), d55)).toEqual(boxStuckRight);
    });
  });
});

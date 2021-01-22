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
import { Box, box } from './Box';
import { pos } from './Pos';
import { place } from './Popover';

describe('popover 2 tests', () => {
  const viewport: Dim = dim(100);

  const place_ = (refBox: Box) => (elem: Dim) => place(viewport, refBox, elem);

  describe('top left', () => {
    const doPlace = place_(box(pos(10, 10), dim(10)));

    test('should align top right', () => {
      expect(doPlace(dim(50))).toEqual(box(pos(20, 10), dim(50)));
    });

    test('should translate up if not enough space to align top right', () => {
      expect(doPlace(dim(50, 95))).toEqual(box(pos(20, 5), dim(50, 95)));
    });

    test('should fit vertically if too high', () => {
      expect(doPlace(dim(50, 200))).toEqual(box(pos(20, 0), dim(50, 100)));
    });

    test("should translate up and left if doesn't fit", () => {
      expect(doPlace(dim(85, 95))).toEqual(box(pos(15, 5), dim(85, 95)));
    });
  });

  describe('bottom left', () => {
    const doPlace = place_(box(pos(10, 80), dim(10)));

    test('should align bottom right', () => {
      expect(doPlace(dim(50))).toEqual(box(pos(20, 40), dim(50)));
    });

    test('shoult fit vertically if too high', () => {
      expect(doPlace(dim(50, 200))).toEqual(box(pos(20, 0), dim(50, 100)));
    });
  });

  describe('top right', () => {
    const doPlace = place_(box(pos(80, 10), dim(10)));

    test('should align top left', () => {
      expect(doPlace(dim(50))).toEqual(box(pos(30, 10), dim(50)));
    });

    test('should translate up if not enough space to aligh top left', () => {
      expect(doPlace(dim(50, 95))).toEqual(box(pos(30, 5), dim(50, 95)));
    });

    test('should fit vertically if too high', () => {
      expect(doPlace(dim(50, 200))).toEqual(box(pos(30, 0), dim(50, 100)));
    });
  });

  describe('bottom right', () => {
    const doPlace = place_(box(pos(80, 80), dim(10)));

    test('should align bottom left', () => {
      expect(doPlace(dim(50))).toEqual(box(pos(30, 40), dim(50)));
    });

    test('should fit vertically if too high', () => {
      expect(doPlace(dim(50, 200))).toEqual(box(pos(30, 0), dim(50, 100)));
    });
  });
});

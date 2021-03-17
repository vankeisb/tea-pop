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

import { pos, Pos } from './Pos';
import { dim, Dim } from './Dim';

export class Box {
  constructor(readonly p: Pos, readonly d: Dim) {}

  static fromDomRect(rect: DOMRect): Box {
    const { x, y, height, width } = rect;
    return box(pos(x, y), dim(width, height));
  }

  get topLeft(): Pos {
    return this.p;
  }

  get bottomRight(): Pos {
    return pos(this.right, this.bottom);
  }

  get left(): number {
    return this.p.x;
  }

  get right() {
    return this.left + this.d.w;
  }

  get top() {
    return this.p.y;
  }

  get bottom() {
    return this.top + this.d.h;
  }

  isPointInside(pos: Pos): boolean {
    return !(
      pos.x < this.left ||
      pos.x > this.right ||
      pos.y < this.top ||
      pos.y > this.bottom
    );
  }

  isBoxInside(box: Box): boolean {
    return this.isPointInside(box.topLeft) && this.isPointInside(box.bottomRight);
  }
}

export function box(p: Pos, d: Dim): Box {
  return new Box(p, d);
}

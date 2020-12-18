import {adjustPopover} from "./Popover";
import {dim, Dim} from "./Dim";
import {box} from "./Box";
import {pos} from "./Pos";

const viewport: Dim = dim(100, 200);

describe("popover tests", () => {

  test("no changes if doesn't overflow", () => {
    const b = box(pos(10, 20), dim(25, 25));
    const b2 = adjustPopover(viewport, b);
    expect(b).toEqual(b2);
  });

  test("should move up if it overflows the bottom", () => {
    const p = pos(10, 180);
    const d = dim(50, 30);
    const b = box(p, d);
    const b2 = adjustPopover(viewport, b);
    expect(b2.d).toEqual(d);
    expect(b2.p.x).toEqual(b2.p.x);
    expect(b2.p.y).toEqual(p.y - 10);
  });

  test("should have the viewport's height if bigger", () => {
    const p = pos(10, 100);
    const d = dim(50, 250);
    const b = box(p, d);
    const b2 = adjustPopover(viewport, b);
    expect(b2.p.x).toEqual(b.p.x);
    expect(b2.p.y).toEqual(0);
    expect(b2.d.h).toEqual(viewport.h);
    expect(b2.d.w).toEqual(b.d.w);
  });

  test("should move left if it overflows the right", () => {
    const p = pos(80, 10);
    const d = dim(30, 50);
    const b = box(p, d);
    const b2 = adjustPopover(viewport, b);
    expect(b2.d).toEqual(d);
    expect(b2.p.y).toEqual(b2.p.y);
    expect(b2.p.x).toEqual(p.x - 10);
  });

  test("should have the viewport's width if bigger", () => {
    const p = pos(10, 100);
    const d = dim(250, 50);
    const b = box(p, d);
    const b2 = adjustPopover(viewport, b);
    expect(b2.p.y).toEqual(b.p.y);
    expect(b2.p.x).toEqual(0);
    expect(b2.d.w).toEqual(viewport.w);
    expect(b2.d.h).toEqual(b.d.h);
  });

  test("should move if overflows right and bottom", () => {
    const p = pos(80, 180);
    const d = dim(50, 55);
    const b = box(p, d);
    const b2 = adjustPopover(viewport, b);
    expect(b2.p.y).toEqual(b.p.y - 35);
    expect(b2.p.x).toEqual(b.p.x - 30);
    expect(b2.d).toEqual(d);
  });


})

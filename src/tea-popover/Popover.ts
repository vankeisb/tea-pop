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

  }


  if (newX === x && newY === y && newH === h && newW === w) {
    return elem;
  }

  return box(pos(newX, newY), dim(newW, newH));
}

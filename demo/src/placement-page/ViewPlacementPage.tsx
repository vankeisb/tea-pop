import * as React from 'react';
import {Dispatcher} from "tea-cup-core";
import {PlacementPageMsg} from "./PlacementPageMsg";
import {PlacementPage} from "./PlacementPage";
import {box, Box, Dim, dim, placeMenu, placeCombo, placeComboSliding, Pos, pos} from "tea-pop-core";

export function viewPlacementPage(dispatch: Dispatcher<PlacementPageMsg>, page: PlacementPage) {
  const {viewportDim} = page;
  return viewportDim.map(vd => {
    const placeFct = page.mode === "menu" ? placeMenu : (page.mode === "drop-down" ? placeCombo : placeComboSliding)
    const {mousePos} = page;
    const elemDim = dim(600, 400);
    const refDim = dim(100, 50);
    const placedBox: Box = placeFct(vd, box(pos(mousePos.x, mousePos.y), refDim), elemDim);
    const viewDim = (d: Dim) => <span>{d.w}*{d.h}</span>
    const viewPos = (p: Pos) => <span>{p.x}:{p.y}</span>
    return (
        <div className="demo">
          <div className="dimensions">
            <ul>
              <li>mode: {page.mode} (toggle with <code>space</code>)</li>
              <li>elem: {viewDim(elemDim)}</li>
              <li>viewport: {viewDim(vd)}</li>
              <li>ref: {viewDim(refDim)}</li>
              <li>mousePos: {viewPos(mousePos)}</li>
              <li>placed: {viewPos(placedBox.p)}, {viewDim(placedBox.d)}</li>
            </ul>
          </div>
          <div className="ref-elem" style={{
            height: refDim.h,
            width: refDim.w,
            left: page.mousePos.x,
            top: page.mousePos.y,
          }}>
          </div>
          <div className="menu-elem" style={{
            height: placedBox.d.h,
            width: placedBox.d.w,
            left: placedBox.p.x,
            top: placedBox.p.y,
          }}>
          </div>
        </div>
    )
  }).withDefaultSupply(() => <></>);
}

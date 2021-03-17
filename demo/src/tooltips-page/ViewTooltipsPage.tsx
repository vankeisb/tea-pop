import * as React from 'react';
import {Dispatcher} from "react-tea-cup";
import {TooltipsPageMsg} from "./TooltipsPageMsg";
import {TooltipsPage} from "./TooltipsPage";

export function viewTooltipsPage(dispatch: Dispatcher<TooltipsPageMsg>, page: TooltipsPage) {
  const steps = 10;
  const padding = 4;
  return page.viewportDim
      .map(viewportDim => {
        const xStep = Math.floor(viewportDim.w / steps);
        const yStep = Math.floor(viewportDim.h / steps);
        const buttons = [];
        let btnIndex = 1;
        const height = yStep - (padding * 2);
        const width = xStep - (padding * 2);
        for (let x = 0; (x + padding + width) < viewportDim.w; x += xStep) {
          for (let y = 0; (y + padding + height) < viewportDim.h; y += yStep) {
            const curBtnIndex = btnIndex;
            const top = y + padding;
            const left = x + padding;
            buttons.push(
                <div
                    key={"btn" + btnIndex}
                    style={{
                      position: "absolute",
                      top,
                      left,
                      height,
                      width,
                      border: "none",
                      backgroundColor: "lightblue",
                    }}
                    // onClick={(evt) => dispatch({
                    //   tag: "button-clicked",
                    //   index: curBtnIndex,
                    //   b: Box.fromDomRect((evt.target as HTMLElement).getBoundingClientRect())
                    // })}
                >
                  {btnIndex}
                </div>
            )
            btnIndex++;
          }
        }
        return (
            <>
              <div className="drop-down-page">
                {buttons}
              </div>
              {/*{page.indexAndModel*/}
              {/*    .map(ddModel =>*/}
              {/*        <ViewDropDown renderer={() => <div className="my-drop-down">HELLO</div>} model={ddModel.b}/>*/}
              {/*    )*/}
              {/*    .withDefaultSupply(() => <></>)*/}
              {/*}*/}
            </>
        )
      })
      .withDefaultSupply(() => <></>)
}

import * as React from 'react';
import {Dispatcher, map} from "react-tea-cup";
import {menuPageMsg, Msg} from "../Msg";
import {MenuPage} from "./MenuPage";
import {stopEvent} from "tea-pop-core";
import {defaultItemRenderer, ViewMenu} from "tea-pop-menu";
import {menuMsg} from "./MenuPageMsg";

const MyRenderer = defaultItemRenderer((s: string) => <span>{s}</span>);

export function viewMenuPage(dispatch: Dispatcher<Msg>, page: MenuPage) {
  const d = map(dispatch, menuPageMsg);
  return (
      <>
        <div
            className="demo"
            onContextMenu={stopEvent}
            onMouseDown={e => d({tag: 'mouse-down', button: e.button})}
        >
          {page.menuModel
              .map(() => <span>Menu is open</span>)
              .withDefaultSupply(() =>
                  page.lastClicked
                      .map(lastClicked => <span>You selected <em>{lastClicked}</em></span>)
                      .withDefaultSupply(() =>
                          <>
                            <div>Right-click anywhere, or use the <code>≣</code> key.</div>
                          </>
                      )
              )
          }
        </div>
        {page.menuModel
            .map(menuModel =>
                <ViewMenu
                    model={menuModel}
                    dispatch={map(dispatch, m => menuPageMsg(menuMsg(m)))}
                    renderer={MyRenderer}
                />
            )
            .withDefault(<></>)
        }
      </>
  )
}

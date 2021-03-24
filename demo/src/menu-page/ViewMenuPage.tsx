import * as React from 'react';
import {Dispatcher, map} from "tea-cup-core";
import {MenuPage} from "./MenuPage";
import {stopEvent} from "tea-pop-core";
import {defaultItemRenderer, ViewMenu} from "tea-pop-menu";
import {menuMsg, MenuPageMsg} from "./MenuPageMsg";

const MyRenderer = defaultItemRenderer((s: string) => <span>{s}</span>);

export function viewMenuPage(dispatch: Dispatcher<MenuPageMsg>, page: MenuPage) {
  return (
      <>
        <div
            className="demo"
            onContextMenu={stopEvent}
            onMouseDown={e => dispatch({tag: 'mouse-down', button: e.button})}
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
                    dispatch={map(dispatch, menuMsg)}
                    renderer={MyRenderer}
                />
            )
            .withDefault(<></>)
        }
      </>
  )
}

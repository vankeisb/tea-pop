import {Cmd, just, noCmd, nothing, Sub, Task, Tuple, WindowEvents} from "react-tea-cup";
import {Dim, dim, windowDimensions} from "tea-pop-core";
import {TooltipsPage} from "./TooltipsPage";
import {gotWindowDimensions, TooltipsPageMsg} from "./TooltipsPageMsg";

export function tooltipsPageInit(): [TooltipsPage, Cmd<TooltipsPageMsg>] {
  const getWindowDimensions: Task<never, Dim> = Task.succeedLazy(() =>
      windowDimensions(),
  );
  const page: TooltipsPage = {
    tag: "tooltips-page",
    viewportDim: nothing,
  }
  return Tuple.t2n(page, Task.perform(getWindowDimensions, gotWindowDimensions));
}

export function tooltipsPageUpdate(msg: TooltipsPageMsg, ttPage: TooltipsPage): [TooltipsPage, Cmd<TooltipsPageMsg>] {
  switch (msg.tag) {
    case "got-window-dimensions": {
      return noCmd({
        ...ttPage,
        viewportDim: just(msg.d)
      });
    }
  }
}

const windowEvents = new WindowEvents();

export function dropDownPageSubs(): Sub<TooltipsPageMsg> {
  return Sub.batch([
    windowEvents.on('resize', () => gotWindowDimensions(dim(window.innerWidth, window.innerHeight)))
  ]);
}


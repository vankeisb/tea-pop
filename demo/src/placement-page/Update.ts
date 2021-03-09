import {PlacementMode, PlacementPage} from "./PlacementPage";
import {gotWindowDimensions, onKeyDown, onMouseMove, PlacementPageMsg} from "./PlacementPageMsg";
import {Cmd, DocumentEvents, just, noCmd, nothing, Sub, Task, Tuple, WindowEvents} from "react-tea-cup";
import {dim, Pos, pos} from "tea-pop-core";

export function placementPageInit(): [PlacementPage, Cmd<PlacementPageMsg>] {
  const pp: PlacementPage = {
    tag: "placement-page",
    viewportDim: nothing,
    mode: "menu",
    mousePos: Pos.origin
  }
  const cmd: Cmd<PlacementPageMsg> = Task.perform(
      Task.succeedLazy(() => dim(window.innerWidth, window.innerHeight)),
      gotWindowDimensions
  );
  return Tuple.t2n(pp, cmd);
}

function nextMode(mode: PlacementMode): PlacementMode {
  switch (mode) {
    case "menu":
      return "drop-down";
    case "drop-down":
      return "drop-down-sliding";
    default:
      return "menu";
  }
}

export function placementPageUpdate(msg: PlacementPageMsg, page: PlacementPage): [PlacementPage, Cmd<PlacementPageMsg>] {
  switch (msg.tag) {
    case "got-window-dimensions": {
      return noCmd({
        ...page,
        viewportDim: just(msg.d)
      });
    }
    case "key-down": {
      return noCmd(
          msg.key === " "
            ? { ...page, mode: nextMode(page.mode) }
            : page
      );
    }
    case "mouse-move": {
      return noCmd({...page, mousePos: msg.pos})
    }
  }
}

const documentEvents = new DocumentEvents();
const windowEvents = new WindowEvents();

export function placementPageSubs(): Sub<PlacementPageMsg> {
  const mouseMove: Sub<PlacementPageMsg> = documentEvents.on('mousemove', e => onMouseMove(pos(e.pageX, e.pageY)));
  const keyDown: Sub<PlacementPageMsg> = documentEvents.on('keydown', e => onKeyDown(e.key));
  return Sub.batch([
    mouseMove,
    keyDown,
    windowEvents.on('resize', e => gotWindowDimensions(dim(window.innerWidth, window.innerHeight)))
  ])
}

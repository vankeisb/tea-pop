import {DropDownPage} from "./DropDownPage";
import {ddMsg, DropDownPageMsg, gotWindowDimensions} from "./DropDownPageMsg";
import {Cmd, just, noCmd, nothing, Sub, Task, Tuple, WindowEvents} from "react-tea-cup";
import {
  DropDownModel,
  DropDownMsg,
  dropDownOpen,
  DropDownRequestClose,
  dropDownSubscriptions,
  dropDownUpdate
} from "tea-pop-dropdown";
import {Dim, dim, windowDimensions} from "tea-pop-core";

export function dropDownPageInit(): [DropDownPage, Cmd<DropDownPageMsg>] {
  const getWindowDimensions: Task<never, Dim> = Task.succeedLazy(() =>
      windowDimensions(),
  );
  const page: DropDownPage = {
    tag: "drop-down-page",
    viewportDim: nothing,
    indexAndModel: nothing,
  }
  return Tuple.t2n(page, Task.perform(getWindowDimensions, gotWindowDimensions));
}

export function dropDownPageUpdate(msg: DropDownPageMsg, ddPage: DropDownPage): [DropDownPage, Cmd<DropDownPageMsg>] {
  switch (msg.tag) {
    case "button-clicked": {
      const ddMac: [DropDownModel, Cmd<DropDownMsg>] = dropDownOpen(Task.succeed(msg.b));
      const newPage: DropDownPage = {
        ...ddPage,
        indexAndModel: just(new Tuple(msg.index, ddMac[0]))
      };
      return Tuple.t2n(
          newPage,
          ddMac[1].map(ddMsg)
      );
    }
    case "dd-msg": {
      return ddPage.indexAndModel
          .map(iam => {
            const ddMac: [DropDownModel, Cmd<DropDownMsg>, DropDownRequestClose] = dropDownUpdate(msg.msg, iam.b);
            if (ddMac[2]) {
              // close requested
              const newPage: DropDownPage = {
                ...ddPage,
                  indexAndModel: nothing,
              };
              return noCmd<DropDownPage, DropDownPageMsg>(newPage);
            }
            const res: [DropDownPage, Cmd<DropDownPageMsg>] = Tuple.fromNative([ddMac[0], ddMac[1]])
                .mapFirst(ddModel => ({
                    ...ddPage,
                    indexAndModel: ddPage.indexAndModel.map(t => new Tuple(t.a, ddModel))
                  }))
                .mapSecond(c => c.map(ddMsg))
                .toNative();
            return res;
          })
          .withDefaultSupply(() => noCmd(ddPage));
    }
    case "got-window-dimensions": {
      return noCmd({
        ...ddPage,
        viewportDim: just(msg.d)
      });
    }
  }
}

const windowEvents = new WindowEvents();

export function dropDownPageSubs(): Sub<DropDownPageMsg> {
  return Sub.batch([
    dropDownSubscriptions().map(ddMsg),
    windowEvents.on('resize', () => gotWindowDimensions(dim(window.innerWidth, window.innerHeight)))
  ]);
}


import { Cmd, Sub, Task } from "tea-cup-fp";
import {
  comboBoxInit,
  ComboBoxProvider,
  comboBoxSubscriptions,
  comboBoxUpdate,
} from "tea-pop-combobox";
import { ComboPage } from "./ComboPage";
import { comboBoxMsg, ComboPageMsg } from "./ComboPageMsg";

const myItems: string[] = [];
for (let i = 0; i < 100; i++) {
  myItems.push("i" + i + " is my item " + i);
}

class MyProvider implements ComboBoxProvider<string> {
  itemToString(item: string): string {
    return item;
  }
  fetchItems(value: string): Task<Error, ReadonlyArray<string>> {
    return Task.succeedLazy(() => {
      console.log("provider " + value);
      return value === ""
        ? myItems
        : myItems.filter((x) => x.indexOf(value) !== -1);
    });
  }
}

const myProvider = new MyProvider();

export function comboPageInit(): [ComboPage, Cmd<ComboPageMsg>] {
  const mac = comboBoxInit<string>();
  const page: ComboPage = {
    tag: "combo-page",
    comboModel: mac[0],
  };
  return [page, mac[1].map(comboBoxMsg)];
}

export function comboPageUpdate(
  msg: ComboPageMsg,
  model: ComboPage
): [ComboPage, Cmd<ComboPageMsg>] {
  switch (msg.tag) {
    case "tea-pop-combobox-msg": {
      const maco = comboBoxUpdate(myProvider, msg.child, model.comboModel);
      maco[2].forEach((out) => {
        console.log("out", out);
      });
      // TODO handle out
      const newModel: ComboPage = {
        ...model,
        comboModel: maco[0],
      };
      return [newModel, maco[1].map(comboBoxMsg)];
    }
  }
}

export function comboPageSubs(model: ComboPage): Sub<ComboPageMsg> {
  return comboBoxSubscriptions(model.comboModel).map(comboBoxMsg);
}

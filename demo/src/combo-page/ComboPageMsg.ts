import { ComboBoxMsg } from "tea-pop-combobox";

export type ComboPageMsg = 
    | { tag: "tea-pop-combobox-msg", child: ComboBoxMsg<any> }

export function comboBoxMsg(child: ComboBoxMsg<any>): ComboPageMsg {
    return {
        tag: "tea-pop-combobox-msg",
        child
    }
}    
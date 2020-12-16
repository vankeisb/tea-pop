import {EventHandler} from "react";

export const stopEvent: EventHandler<any> = e => {
  e.preventDefault();
  e.stopPropagation();
}

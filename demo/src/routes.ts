import { newUrl, route0, route1, Router, str } from "react-tea-cup";
import { Msg, noop } from "./Msg";
import { Cmd, Task } from "tea-cup-fp";

export type Route = "home" | "menu" | "dropdown" | "placement" | "combo";

export const router: Router<Route> = new Router<Route>(
  route0.map(() => "home"),
  route1(str("menu")).map(() => "menu"),
  route1(str("dropdown")).map(() => "dropdown"),
  route1(str("placement")).map(() => "placement"),
  route1(str("combo")).map(() => "combo")
);

export function routeToUrl(route: Route): string {
  switch (route) {
    case "home": {
      return "/";
    }
    default:
      return "/" + route;
  }
}

export function navigateTo(route: Route): Cmd<Msg> {
  return Task.perform(newUrl(routeToUrl(route)), () => noop);
}

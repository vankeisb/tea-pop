import {route0, route1, Router, str} from "react-tea-cup";

export type Route = 'home' | 'menu' | 'dropdown' | 'tooltip' | 'placement'

export const router: Router<Route> = new Router<Route>(
    route0.map(() => 'home'),
    route1(str("menu")).map(() => 'menu'),
    route1(str("dropdown")).map(() => 'dropdown'),
    route1(str("tooltip")).map(() => 'tooltip'),
    route1(str("placement")).map(() => 'placement'),
)

export function routeToUrl(route: Route): string {
  switch (route) {
    case "home": {
      return "/";
    }
    default:
      return "/" + route;
  }
}


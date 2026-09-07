import { Hono } from "hono"
import { WeebPanel } from "../Wepan"

export type ApiRoute = (this: Hono, panel: WeebPanel) => unknown

export function loadRoute(route: ApiRoute): ApiRoute {
  return route
}

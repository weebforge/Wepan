import { APIEnv, APIHono, WeebPanel } from "../classes/Wepan"
import {
  WeebPanelPermission,
  WeebPanelPermissionResolvable,
  WeebPanelPermissionsBitField,
} from "../classes/WepanPermission"

import { Handler } from "hono"

export type ApiRoute = (this: APIHono, panel: WeebPanel) => unknown

export function loadRoute(route: ApiRoute): ApiRoute {
  return route
}

export function markPrivateRoute(route: Handler<APIEnv>, permissions: WeebPanelPermissionResolvable): Handler<APIEnv> {
  return async (c, next) => {
    const panel = c.get("Panel")
    const authorization = c.req.header("Authorization")

    if (!authorization) return c.json({ error: "Missing authorization" }, 401)

    const user = panel.checkAccessKey(c)
    if (!user) return c.json({ error: "Invalid access key" }, 403)

    const userPermissions = new WeebPanelPermissionsBitField(user.permissions)
    if (!userPermissions.has(WeebPanelPermission.Admin) && !userPermissions.has(permissions)) {
      return c.json({ error: "Insufficient permissions" }, 403)
    }

    c.set("User", user)
    return route(c, next)
  }
}

/**
 * Usage:
 * import { loadRoute, markPrivateRoute, WeebPanelPermission } from "../load"
 *
 * export default loadRoute(function (this: APIHono, panel: WeebPanel) {
 *   this.get("/public", (c) => {
 *   return c.json({ message: "This is a public route" })
 * })
 *  this.get("/private", markPrivateRoute(function (c) {
 *  return c.json({ message: "This is a private route" })
 * }, [WeebPanelPermission.Admin]))
 */

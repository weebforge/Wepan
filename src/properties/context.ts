import { basePath, baseRoutePath, matchedRoutes, routePath } from "hono/route";

import { Context } from "hono";
import defineProperties from "@tryforge/forgescript/dist/functions/defineProperties";

export enum ContextProperty {
  env = "env",
  error = "error",
  method = "method",
  url = "url",
  path = "path",
  routePath = "routePath",
  matchedRoutePath = "matchedRoutePath",
  baseRoutePath = "baseRoutePath",
  basePath = "basePath",
}

export const ContextProperties = defineProperties<
  typeof ContextProperty,
  Context
>({
  env: (c) => c?.env,
  error: (c) => c?.error?.message,
  method: (c) => c?.req.method,
  url: (c) => c?.req.url,
  path: (c) => c?.req.path,
  routePath: (c) => (c ? routePath(c) : null),
  matchedRoutePath: (c, s) =>
    c
      ? matchedRoutes(c)
          .map((m) => `${m.method} ${m.path}`)
          .join(s ?? ",")
      : null,
  baseRoutePath: (c) => (c ? baseRoutePath(c) : null),
  basePath: (c) => (c ? basePath(c) : null),
});

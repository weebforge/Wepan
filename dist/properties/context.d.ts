import { Context } from "hono";
export declare enum ContextProperty {
    env = "env",
    error = "error",
    method = "method",
    url = "url",
    path = "path",
    routePath = "routePath",
    matchedRoutePath = "matchedRoutePath",
    baseRoutePath = "baseRoutePath",
    basePath = "basePath"
}
export declare const ContextProperties: import("@tryforge/forgescript").Properties<typeof ContextProperty, Context<any, any, {}>>;
//# sourceMappingURL=context.d.ts.map
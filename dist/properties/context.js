"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextProperties = exports.ContextProperty = void 0;
const route_1 = require("hono/route");
const defineProperties_1 = __importDefault(require("@tryforge/forgescript/dist/functions/defineProperties"));
var ContextProperty;
(function (ContextProperty) {
    ContextProperty["env"] = "env";
    ContextProperty["error"] = "error";
    ContextProperty["method"] = "method";
    ContextProperty["url"] = "url";
    ContextProperty["path"] = "path";
    ContextProperty["routePath"] = "routePath";
    ContextProperty["matchedRoutePath"] = "matchedRoutePath";
    ContextProperty["baseRoutePath"] = "baseRoutePath";
    ContextProperty["basePath"] = "basePath";
})(ContextProperty || (exports.ContextProperty = ContextProperty = {}));
exports.ContextProperties = (0, defineProperties_1.default)({
    env: (c) => c?.env,
    error: (c) => c?.error?.message,
    method: (c) => c?.req.method,
    url: (c) => c?.req.url,
    path: (c) => c?.req.path,
    routePath: (c) => (c ? (0, route_1.routePath)(c) : null),
    matchedRoutePath: (c, s) => c
        ? (0, route_1.matchedRoutes)(c)
            .map((m) => `${m.method} ${m.path}`)
            .join(s ?? ",")
        : null,
    baseRoutePath: (c) => (c ? (0, route_1.baseRoutePath)(c) : null),
    basePath: (c) => (c ? (0, route_1.basePath)(c) : null),
});
//# sourceMappingURL=context.js.map
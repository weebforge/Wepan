"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRoute = loadRoute;
exports.markPrivateRoute = markPrivateRoute;
const WepanPermission_1 = require("../classes/WepanPermission");
function loadRoute(route) {
    return route;
}
function markPrivateRoute(route, permissions) {
    return async (c, next) => {
        const panel = c.get("Panel");
        const authorization = c.req.header("Authorization");
        if (!authorization)
            return c.json({ error: "Missing authorization" }, 401);
        const user = panel.checkAccessKey(c);
        if (!user)
            return c.json({ error: "Invalid access key" }, 403);
        const userPermissions = new WepanPermission_1.WeebPanelPermissionsBitField(user.permissions);
        if (!userPermissions.has(WepanPermission_1.WeebPanelPermission.Admin) &&
            !userPermissions.has(permissions)) {
            return c.json({ error: "Insufficient permissions" }, 403);
        }
        c.set("User", user);
        return route(c, next);
    };
}
//# sourceMappingURL=load.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const load_1 = require("../load");
exports.default = (0, load_1.loadRoute)(function (panel) {
    this.get("/status", (c) => {
        return c.json({ status: "ok" });
    });
    this.post("/login", (c) => {
        const user = panel.checkAccessKey(c);
        if (!user)
            return c.json({ error: "Invalid access key" }, 401);
        return c.json({ user: user.userId, permissions: user.permissions });
    });
});
//# sourceMappingURL=public.js.map
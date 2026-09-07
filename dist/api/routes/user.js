"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const load_1 = require("../load");
exports.default = (0, load_1.loadRoute)(function () {
    this.get("/user/:userId", (0, load_1.markPrivateRoute)(async (c) => {
        let userId = c.req.param("userId");
        if (!userId)
            return c.json({ error: "Missing user ID" }, 400);
        if (userId == "@me")
            userId = c.get("User").userId;
        const user = await this.client.users.fetch(userId).catch(() => null);
        if (!user)
            return c.json({ error: "User not found" }, 404);
        return c.json(user.toJSON());
    }, 0));
});
//# sourceMappingURL=user.js.map
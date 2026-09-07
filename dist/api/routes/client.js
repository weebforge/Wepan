"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const load_1 = require("../load");
exports.default = (0, load_1.loadRoute)(function () {
    this.get("/client", (0, load_1.markPrivateRoute)((c) => {
        const { user, application } = this.client;
        let res = { user: user.toJSON(), application: application.toJSON() };
        return c.json(res);
    }, []));
    this.get("/client/guilds", (0, load_1.markPrivateRoute)((c) => {
        return c.json(this.client.guilds.cache.map((guild) => guild.toJSON()));
    }, 0));
});
//# sourceMappingURL=client.js.map
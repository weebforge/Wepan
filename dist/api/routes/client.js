"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const load_1 = require("../load");
exports.default = (0, load_1.loadRoute)(function () {
    this.get("/client", (c) => {
        const { user, application } = this.client;
        let res = { user: user.toJSON(), application: application.toJSON() };
        return c.json(res);
    });
});
//# sourceMappingURL=client.js.map
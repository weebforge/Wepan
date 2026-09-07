"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const load_1 = require("../load");
exports.default = (0, load_1.loadRoute)(function () {
    this.get("/guild/:guildId", (0, load_1.markPrivateRoute)(async (c) => {
        const guildId = c.req.param("guildId");
        if (!guildId)
            return c.json({ error: "Missing guild ID" }, 400);
        const guild = await this.client.guilds.fetch(guildId).catch(() => null);
        if (!guild)
            return c.json({ error: "Guild not found" }, 404);
        return c.json(guild.toJSON());
    }, 0));
});
//# sourceMappingURL=guild.js.map
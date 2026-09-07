"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const load_1 = require("../load");
exports.default = (0, load_1.loadRoute)(function (panel) {
    this.get("/status", (c) => {
        return c.json({ status: "ok" });
    });
    this.get("/stats", (c) => {
        const client = this.client;
        return c.json({
            uptime: client.uptime,
            guilds: client.guilds.cache.size,
            users: [
                client.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
                client.users.cache.size,
            ],
            channels: client.channels.cache.size,
            websocket: {
                status: client.ws.status,
                ping: client.ws.ping,
            },
        });
    });
    this.get("/client-public", (c) => {
        const client = this.client.user;
        return c.json({
            username: client.username,
            discrimintor: client.discriminator,
            avatar: client.displayAvatarURL({ size: 2048 }),
            banner: client.bannerURL({ size: 2048 }) ?? null,
            id: client.id,
            description: this.client.application.description,
        });
    });
    this.post("/login", (c) => {
        const user = panel.checkAccessKey(c);
        if (!user)
            return c.json({ error: "Invalid access key" }, 401);
        return c.json({ user: user.userId, permissions: user.permissions });
    });
});
//# sourceMappingURL=public.js.map
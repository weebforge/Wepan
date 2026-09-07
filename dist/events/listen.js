"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const Wepan_1 = require("../classes/Wepan");
const WepanEventManager_1 = require("../classes/WepanEventManager");
exports.default = new WepanEventManager_1.WeebPanelEventHandler({
    name: "listen",
    version: "1.0.0",
    description: "Runs when the panel listens.",
    listener(ctx) {
        const commands = this.getExtension(Wepan_1.WeebPanel, true).commands.get("listen");
        for (const command of commands) {
            forgescript_1.Interpreter.run({
                obj: {},
                client: this,
                command,
                data: command.compiled.code,
                extras: ctx,
            });
        }
    },
});
//# sourceMappingURL=listen.js.map
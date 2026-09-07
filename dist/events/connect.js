"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const Wepan_1 = require("../classes/Wepan");
const WepanEventManager_1 = require("../classes/WepanEventManager");
exports.default = new WepanEventManager_1.WeebPanelEventHandler({
    name: "connect",
    version: "1.0.0",
    description: "Runs when the server is connected.",
    listener(info) {
        const commands = this.getExtension(Wepan_1.WeebPanel, true).commands.get("connect");
        if (commands.length) {
            for (const command of commands) {
                forgescript_1.Interpreter.run({
                    obj: {},
                    client: this,
                    command,
                    data: command.compiled.code,
                    extras: info,
                    environment: {
                        info,
                    },
                });
            }
        }
        else {
            const address = info.address === "::" ? "localhost" : info.address;
            forgescript_1.Logger.info(`WeebPanel listening at ${address}:${info.port}`);
        }
    },
});
//# sourceMappingURL=connect.js.map
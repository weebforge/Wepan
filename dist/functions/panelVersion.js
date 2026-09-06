"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const Wepan_1 = require("../Wepan");
exports.default = new forgescript_1.NativeFunction({
    name: "$panelVersion",
    description: "Returns installed panel version.",
    version: "1.0.0",
    unwrap: true,
    output: forgescript_1.ArgType.String,
    execute(ctx) {
        return this.success(ctx.client.getExtension(Wepan_1.WeebPanel, true).version);
    },
});
//# sourceMappingURL=panelVersion.js.map
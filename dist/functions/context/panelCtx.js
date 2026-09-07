"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const context_1 = require("../../properties/context");
const hono_1 = require("hono");
exports.default = new forgescript_1.NativeFunction({
    name: "$panelCtx",
    aliases: ["$wpn", "$wpnCtx"],
    version: "1.0.0",
    description: "Returns the context info",
    unwrap: true,
    brackets: true,
    args: [
        forgescript_1.Arg.requiredEnum(context_1.ContextProperty, "property", "The proprty of context"),
        forgescript_1.Arg.optionalString("sep", "The seperator"),
    ],
    output: forgescript_1.ArgType.Unknown,
    execute(ctx, [prop, sep]) {
        if (!(ctx.runtime.extras instanceof hono_1.Context))
            return this.customError("No context found.");
        return this.success(context_1.ContextProperties[prop](ctx.runtime.extras, sep));
    },
});
//# sourceMappingURL=panelCtx.js.map
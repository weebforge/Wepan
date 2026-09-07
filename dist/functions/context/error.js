"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const hono_1 = require("hono");
exports.default = new forgescript_1.NativeFunction({
    name: "$error",
    version: "1.0.0",
    description: "Returns the error message",
    unwrap: false,
    output: forgescript_1.ArgType.Unknown,
    execute(ctx) {
        if (ctx.runtime.extras instanceof hono_1.Context && ctx.runtime.extras.error instanceof Error)
            return this.success(ctx.runtime.extras.error);
        return this.success(ctx.runtime.extras);
    },
});
//# sourceMappingURL=error.js.map
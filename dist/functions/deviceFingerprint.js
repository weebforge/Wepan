"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const fingerprint_1 = require("../util/fingerprint");
exports.default = new forgescript_1.NativeFunction({
    name: "$getDeviceFingerprint",
    aliases: ["$deviceFingerprint", "$fingerprint"],
    description: "Returns the device fingerprint.",
    version: "1.0.0",
    brackets: false,
    args: [
        forgescript_1.Arg.optionalBoolean("asString", "If true, returns the fingerprint as a string. Otherwise, returns it as a bigint."),
    ],
    unwrap: true,
    output: [forgescript_1.ArgType.String, forgescript_1.ArgType.BigInt],
    execute(ctx, [asString]) {
        const fingerprint = asString ? (0, fingerprint_1.getDeviceFingerprint)("string") : (0, fingerprint_1.getDeviceFingerprint)("bigint");
        return this.success(fingerprint);
    },
});
//# sourceMappingURL=deviceFingerprint.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceFingerprint = getDeviceFingerprint;
const node_crypto_1 = __importDefault(require("node:crypto"));
const node_os_1 = __importDefault(require("node:os"));
function getDeviceFingerprint(as = "bigint") {
    const data = [node_os_1.default.hostname(), node_os_1.default.platform(), node_os_1.default.arch(), node_os_1.default.machine()].join("|");
    const fingerprint = node_crypto_1.default.createHash("sha256").update(data).digest("hex").slice(0, 40);
    return as === "bigint" ? BigInt(`0x${fingerprint}`) : fingerprint;
}
//# sourceMappingURL=fingerprint.js.map
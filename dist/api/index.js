"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRoutes = void 0;
const recursiveReaddirSync_1 = __importDefault(require("@tryforge/forgescript/dist/functions/recursiveReaddirSync"));
const ApiRoutes = [];
exports.ApiRoutes = ApiRoutes;
const files = (0, recursiveReaddirSync_1.default)(`${__dirname}/routes`);
for (const file of files) {
    if (!file.endsWith(".js"))
        continue;
    let route = require(file).default;
    ApiRoutes.push(route);
}
//# sourceMappingURL=index.js.map
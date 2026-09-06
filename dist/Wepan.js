"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeebPanel = void 0;
const forgescript_1 = require("@tryforge/forgescript");
class WeebPanel extends forgescript_1.ForgeExtension {
    name = "WeebPanel";
    description = require("../package.json").description;
    version = require("../package.json").version;
    options;
    constructor(options = {}) {
        super();
        this.options = {};
    }
    init(client) {
        this.load(`${__dirname}/functions`);
    }
}
exports.WeebPanel = WeebPanel;
//# sourceMappingURL=Wepan.js.map
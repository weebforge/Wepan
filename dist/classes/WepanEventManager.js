"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeebPanelEventHandler = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const Wepan_1 = require("./Wepan");
class WeebPanelEventHandler extends forgescript_1.BaseEventHandler {
    register(client) {
        client
            .getExtension(Wepan_1.WeebPanel, true)
            .emitter.on(this.name, this.listener.bind(client));
    }
}
exports.WeebPanelEventHandler = WeebPanelEventHandler;
//# sourceMappingURL=WepanEventManager.js.map
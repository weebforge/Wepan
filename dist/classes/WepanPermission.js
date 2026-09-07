"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeebPanelPermissionsBitField = exports.WeebPanelPermission = void 0;
var WeebPanelPermission;
(function (WeebPanelPermission) {
    WeebPanelPermission[WeebPanelPermission["Admin"] = 1] = "Admin";
    WeebPanelPermission[WeebPanelPermission["SendMessages"] = 2] = "SendMessages";
    WeebPanelPermission[WeebPanelPermission["ViewAnalytics"] = 4] = "ViewAnalytics";
    WeebPanelPermission[WeebPanelPermission["ManageGuilds"] = 8] = "ManageGuilds";
})(WeebPanelPermission || (exports.WeebPanelPermission = WeebPanelPermission = {}));
class WeebPanelPermissionsBitField {
    bitfield;
    constructor(bits = 0) {
        this.bitfield = WeebPanelPermissionsBitField.resolve(bits);
    }
    static resolve(bits) {
        if (bits instanceof WeebPanelPermissionsBitField)
            return bits.bitfield;
        if (typeof bits === "number")
            return bits;
        return bits.reduce((bitfield, permission) => bitfield | permission, 0);
    }
    has(permission, checkAny = false) {
        const bits = WeebPanelPermissionsBitField.resolve(permission);
        return checkAny ? (this.bitfield & bits) !== 0 : (this.bitfield & bits) === bits;
    }
    add(...permissions) {
        this.bitfield |= permissions.reduce((bits, permission) => bits | WeebPanelPermissionsBitField.resolve(permission), 0);
        return this;
    }
    remove(...permissions) {
        this.bitfield &= ~permissions.reduce((bits, permission) => bits | WeebPanelPermissionsBitField.resolve(permission), 0);
        return this;
    }
    toJSON() {
        return this.bitfield;
    }
}
exports.WeebPanelPermissionsBitField = WeebPanelPermissionsBitField;
//# sourceMappingURL=WepanPermission.js.map
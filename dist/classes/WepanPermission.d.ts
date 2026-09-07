export declare enum WeebPanelPermission {
    Admin = 1,
    SendMessages = 2,
    ViewAnalytics = 4,
    ManageGuilds = 8
}
export type WeebPanelPermissionResolvable = number | WeebPanelPermissionsBitField | readonly WeebPanelPermission[];
export declare class WeebPanelPermissionsBitField {
    bitfield: number;
    constructor(bits?: WeebPanelPermissionResolvable);
    static resolve(bits: WeebPanelPermissionResolvable): number;
    has(permission: WeebPanelPermissionResolvable, checkAny?: boolean): boolean;
    add(...permissions: WeebPanelPermissionResolvable[]): this;
    remove(...permissions: WeebPanelPermissionResolvable[]): this;
    toJSON(): number;
}
//# sourceMappingURL=WepanPermission.d.ts.map
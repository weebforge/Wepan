import { BaseCommandManager } from "@tryforge/forgescript";
import { IWeebPanelEvents } from "./WepanEventManager";
export declare const WeebPanelEventManagerName = "WeebPanelEvents";
export declare class WeebPanelCommandManager extends BaseCommandManager<keyof IWeebPanelEvents> {
    handlerName: string;
}
//# sourceMappingURL=WepanCommandManager.d.ts.map
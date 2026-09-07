import { BaseCommandManager } from "@tryforge/forgescript";
import { IWeebPanelEvents } from "./WepanEventManager";

export const WeebPanelEventManagerName = "WeebPanelEvents";

export class WeebPanelCommandManager extends BaseCommandManager<
  keyof IWeebPanelEvents
> {
  handlerName = WeebPanelEventManagerName;
}

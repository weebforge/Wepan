import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript";
import { AddressInfo } from "node:net";
import { Context } from "hono";
import { HTTPResponseError } from "hono/types";
export interface IWeebPanelEvents {
    error: [err: Error | HTTPResponseError, ctx: Context];
    connect: [info: AddressInfo];
    listen: [ctx: Context];
}
export declare class WeebPanelEventHandler<T extends keyof IWeebPanelEvents> extends BaseEventHandler<IWeebPanelEvents, T> {
    register(client: ForgeClient): void;
}
//# sourceMappingURL=WepanEventManager.d.ts.map
import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { WeebPanelCommandManager } from "./WepanCommandManager";
import { BlankEnv } from "hono/types";
import { Hono } from "hono";
import { HonoOptions } from "hono/hono-base";
import { IWeebPanelEvents } from "./WepanEventManager";
import { TypedEmitter } from "tiny-typed-emitter";
import { serve } from "@hono/node-server";
export interface IWeebPanelOptions {
    hono?: HonoOptions<BlankEnv>;
    server?: Omit<Parameters<typeof serve>[0], "fetch">;
    events?: Array<keyof IWeebPanelEvents>;
}
export type TransformEvents<T> = {
    [P in keyof T]: T[P] extends any[] ? (...args: T[P]) => any : never;
};
export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]> | undefined;
};
export declare class WeebPanel extends ForgeExtension {
    name: string;
    description: string;
    version: string;
    options: Required<IWeebPanelOptions>;
    emitter: TypedEmitter<TransformEvents<IWeebPanelEvents>>;
    commands: WeebPanelCommandManager;
    app: Hono;
    private api;
    constructor(options?: IWeebPanelOptions);
    init(client: ForgeClient): void;
    private loadApi;
}
//# sourceMappingURL=Wepan.d.ts.map
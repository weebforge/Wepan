import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { BlankEnv } from "hono/types";
import { Hono } from "hono";
import { HonoOptions } from "hono/hono-base";
import { serve } from "@hono/node-server";
export interface IWeebPanelOptions {
    hono?: HonoOptions<BlankEnv>;
    server?: Omit<Parameters<typeof serve>[0], "fetch">;
}
export declare class WeebPanel extends ForgeExtension {
    name: string;
    description: string;
    version: string;
    options: Required<IWeebPanelOptions>;
    app: Hono;
    private api;
    constructor(options?: IWeebPanelOptions);
    init(client: ForgeClient): void;
    private loadApi;
}
//# sourceMappingURL=Wepan.d.ts.map
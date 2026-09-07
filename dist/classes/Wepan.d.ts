import { Context, Hono } from "hono";
import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { WeebPanelCommandManager } from "./WepanCommandManager";
import { WeebPanelPermissionResolvable } from "./WepanPermission";
import { BlankEnv } from "hono/types";
import { HonoOptions } from "hono/hono-base";
import { IWeebPanelEvents } from "./WepanEventManager";
import { TypedEmitter } from "tiny-typed-emitter";
import { serve } from "@hono/node-server";
export interface IWeebPanelOptions {
    hono?: HonoOptions<BlankEnv>;
    server?: Omit<Parameters<typeof serve>[0], "fetch">;
    events?: Array<keyof IWeebPanelEvents>;
    access: {
        token: string;
        userId: string;
        permissions: WeebPanelPermissionResolvable;
    }[];
    logAccessKeys?: boolean;
    accessKeyGenerator?: (userId: string, token: string, permissions: number, seed: BigInt) => BigInt;
    accessKeyGeneratorSeed?: BigInt;
}
export declare const DefaultAccessKeyGeneratorSeed: bigint;
export declare function DefaultAccessKeyGenerator(userId: string, token: string, permissions: number, seed: BigInt): bigint;
export type TransformEvents<T> = {
    [P in keyof T]: T[P] extends any[] ? (...args: T[P]) => any : never;
};
export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]> | undefined;
};
export type APIEnv = {
    Variables: {
        Panel: WeebPanel;
        User: {
            userId: string;
            token: string;
            permissions: number;
        };
    };
};
export type APIHono = Hono<APIEnv>;
export declare class WeebPanel extends ForgeExtension {
    #private;
    name: string;
    description: string;
    version: string;
    options: Required<IWeebPanelOptions>;
    emitter: TypedEmitter<TransformEvents<IWeebPanelEvents>>;
    commands: WeebPanelCommandManager;
    app: Hono;
    private routes;
    constructor(options: IWeebPanelOptions);
    init(client: ForgeClient): void;
    private loadApi;
    private loadPanelFiles;
    checkAccessKey(c: Context | string): {
        userId: string;
        token: string;
        permissions: number;
    } | null;
}
//# sourceMappingURL=Wepan.d.ts.map
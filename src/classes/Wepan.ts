import { Context, Hono } from "hono";
import {
  EventManager,
  ForgeClient,
  ForgeExtension,
  Logger,
} from "@tryforge/forgescript";
import {
  WeebPanelCommandManager,
  WeebPanelEventManagerName,
} from "./WepanCommandManager";
import {
  WeebPanelPermissionResolvable,
  WeebPanelPermissionsBitField,
} from "./WepanPermission";

import { ApiRoutes } from "../api";
import { BlankEnv } from "hono/types";
import { HonoOptions } from "hono/hono-base";
import { IWeebPanelEvents } from "./WepanEventManager";
import { TypedEmitter } from "tiny-typed-emitter";
import { cors } from "hono/cors";
import { getDeviceFingerprint } from "../util/fingerprint";
import { join } from "node:path";
import nodeCrypto from "node:crypto";
import { prettyJSON } from "hono/pretty-json";
import { readFileSync } from "node:fs";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

export interface IWeebPanelOptions {
  hono?: HonoOptions<BlankEnv>;
  server?: Omit<Parameters<typeof serve>[0], "fetch">;
  events?: Array<keyof IWeebPanelEvents>;

  access: {
    token: string;
    userId: string;
    permissions: WeebPanelPermissionResolvable;
  }[];
  /** Log access keys to the console */
  logAccessKeys?: boolean;
  /**
   *  Access key generator function
   * Keys are in form of <userId>-<randomNumber> in base 36, this function allows you to customize the random number generation.
   * NOTE: Try not to use a predictable random number generator, as this can compromise the security of your access keys.
   */
  accessKeyGenerator?: (
    userId: string,
    token: string,
    permissions: number,
    seed: BigInt,
  ) => BigInt;
  accessKeyGeneratorSeed?: BigInt;
}

/** Fingerprint */
export const DefaultAccessKeyGeneratorSeed = getDeviceFingerprint("bigint");
export function DefaultAccessKeyGenerator(
  userId: string,
  token: string,
  permissions: number,
  seed: BigInt,
): bigint {
  const data = [seed, userId, token, permissions].join("|");

  return BigInt(
    `0x${nodeCrypto.createHash("sha256").update(data).digest("hex").slice(0, 40)}`,
  );
}

export type TransformEvents<T> = {
  [P in keyof T]: T[P] extends any[] ? (...args: T[P]) => any : never;
};

export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> | undefined };

export type APIEnv = {
  Variables: {
    Panel: WeebPanel;
    User: { userId: string; token: string; permissions: number };
  };
};
export type APIHono = Hono<APIEnv>;
export class WeebPanel extends ForgeExtension {
  public name: string = "WeebPanel";
  public description: string = require("../../package.json").description;
  public version: string = require("../../package.json").version;

  public options: Required<IWeebPanelOptions>;
  public emitter = new TypedEmitter<TransformEvents<IWeebPanelEvents>>();
  public commands!: WeebPanelCommandManager;

  public app!: Hono;
  private routes!: {
    api: APIHono;
  };

  #generatedAccessKeys: Map<
    string,
    { userId: string; token: string; permissions: number }
  > = new Map();

  constructor(options: IWeebPanelOptions) {
    super();

    // Parse options and set defaults
    this.options = {
      hono: options.hono ?? {},
      server: options.server ?? {},
      events: options.events ?? [],
      access: options.access ?? [],
      logAccessKeys: options.logAccessKeys ?? false,
      accessKeyGenerator:
        options.accessKeyGenerator ?? DefaultAccessKeyGenerator,
      accessKeyGeneratorSeed:
        options.accessKeyGeneratorSeed ?? DefaultAccessKeyGeneratorSeed,
    };

    if (this.options.access.length === 0)
      Logger.warn(
        "WeebPanel: No access keys provided. The panel will be inaccessible without valid access keys.",
      );

    // Generate access keys for each user
    for (const access of this.options.access) {
      const permissions = WeebPanelPermissionsBitField.resolve(
        access.permissions,
      );
      const accessKey = this.options.accessKeyGenerator(
        access.userId,
        access.token,
        permissions,
        this.options.accessKeyGeneratorSeed,
      );
      this.#generatedAccessKeys.set(accessKey.toString(36), {
        token: access.token,
        permissions,
        userId: access.userId,
      });
    }

    if (this.options.logAccessKeys) {
      Logger.info("WeebPanel: Generated Access Keys:");
      for (const [
        key,
        { permissions, userId },
      ] of this.#generatedAccessKeys.entries()) {
        Logger.info(
          ` UserID: ${userId}, Key: ${key}, Permissions: ${permissions}`,
        );
      }
    }
  }

  public init(client: ForgeClient): void {
    this.commands = new WeebPanelCommandManager(client);
    EventManager.load(WeebPanelEventManagerName, join(__dirname, "../events"));
    this.load(join(__dirname, "../functions"));

    if (this.options.events?.length)
      client.events.load(WeebPanelEventManagerName, this.options.events);

    this.app = new Hono(this.options.hono ?? {});
    this.app.client = client;
    this.app.use(async (c, next) => {
      this.emitter.emit("listen", c);
      await next();
      if (c.error) {
        c.error.name = "WeebPanel Error"; // HAHAHAHHA
        this.emitter.emit("error", c.error, c);
      }
    });

    this.routes = {} as any;
    this.loadPanelFiles();
    this.loadApi();

    this.app.notFound((c) => c.text("Not found", 404));

    serve(
      // @ts-ignore- idk  fr
      {
        fetch: this.app.fetch,
        ...this.options.server,
      },
      (i) => this.emitter.emit("connect", i),
    );
  }

  private loadApi() {
    this.routes.api = new Hono();
    this.routes.api.client = this.app.client;
    this.routes.api.use("/*", (c, next) => {
      c.set("Panel", this);
      return next();
    });
    this.routes.api.use("/*", cors());
    this.routes.api.use(
      prettyJSON({
        force: true,
      }),
    );

    //load routes
    ApiRoutes.forEach((route) => route.bind(this.routes.api)(this));

    this.app.route("/api", this.routes.api);
  }

  private loadPanelFiles() {
    this.app.get("/", (c) => c.html(readFileSync("panel/index.html", "utf8")));
    this.app.get("/index.html", (c) => c.redirect("/"));
    this.app.get("/index.ts", (c) => c.notFound());
    this.app.get("/scripts/*", (c) => c.notFound());

    this.app.use(
      "/*",
      serveStatic({
        root: "./panel/",
      }),
    );
  }

  public checkAccessKey(
    c: Context | string,
  ): { userId: string; token: string; permissions: number } | null {
    const authHeader =
      typeof c === "string" ? c : c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

    const [, accessKey] = authHeader.split(" ");
    const accessData = this.#generatedAccessKeys.get(accessKey);
    if (!accessData) return null;

    return {
      userId: accessData.userId,
      token: accessData.token,
      permissions: accessData.permissions,
    };
  }
}

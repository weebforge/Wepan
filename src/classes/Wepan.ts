import { EventManager, ForgeClient, ForgeExtension } from "@tryforge/forgescript"
import { WeebPanelCommandManager, WeebPanelEventManagerName } from "./WepanCommandManager"

import { ApiRoutes } from "../api"
import { BlankEnv } from "hono/types"
import { Hono } from "hono"
import { HonoOptions } from "hono/hono-base"
import { IWeebPanelEvents } from "./WepanEventManager"
import { TypedEmitter } from "tiny-typed-emitter"
import { cors } from "hono/cors"
import { join } from "node:path"
import { prettyJSON } from "hono/pretty-json"
import { readFileSync } from "node:fs"
import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"

export interface IWeebPanelOptions {
  hono?: HonoOptions<BlankEnv>
  server?: Omit<Parameters<typeof serve>[0], "fetch">
  events?: Array<keyof IWeebPanelEvents>
}

export type TransformEvents<T> = {
  [P in keyof T]: T[P] extends any[] ? (...args: T[P]) => any : never
}

export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> | undefined }

export class WeebPanel extends ForgeExtension {
  public name: string = "WeebPanel"
  public description: string = require("../../package.json").description
  public version: string = require("../../package.json").version

  public options: Required<IWeebPanelOptions>
  public emitter = new TypedEmitter<TransformEvents<IWeebPanelEvents>>()
  public commands!: WeebPanelCommandManager

  public app!: Hono
  private routes!: {
    api: Hono
  }

  constructor(options: IWeebPanelOptions = {}) {
    super()

    this.options = {
      hono: options.hono ?? {},
      server: options.server ?? {},
      events: options.events ?? [],
    }
  }

  public init(client: ForgeClient): void {
    this.commands = new WeebPanelCommandManager(client)
    EventManager.load(WeebPanelEventManagerName, join(__dirname, "../events"))
    this.load(join(__dirname, "../functions"))

    if (this.options.events?.length) client.events.load(WeebPanelEventManagerName, this.options.events)

    this.app = new Hono(this.options.hono ?? {})
    this.app.client = client
    this.app.use(async (c, next) => {
      this.emitter.emit("listen", c)
      await next()
      if (c.error) {
        c.error.name = "WeebPanel Error" // HAHAHAHHA
        this.emitter.emit("error", c.error, c)
      }
    })

    this.routes = {} as any
    this.loadPanelFiles()
    this.loadApi()

    this.app.notFound((c) => c.text("Not found", 404))

    serve(
      // @ts-ignore- idk  fr
      {
        fetch: this.app.fetch,
        ...this.options.server,
      },
      (i) => this.emitter.emit("connect", i)
    )
  }

  private loadApi() {
    this.routes.api = new Hono()
    this.routes.api.client = this.app.client
    this.routes.api.use("/*", cors())
    this.routes.api.use(
      prettyJSON({
        force: true,
      })
    )

    //load routes
    ApiRoutes.forEach((route) => route.bind(this.routes.api)(this))

    this.app.route("/api", this.routes.api)
  }

  private loadPanelFiles() {
    this.app.get("/", (c) => c.html(readFileSync("panel/index.html", "utf8")))
    this.app.get("/index.html", (c) => c.redirect("/"))
    this.app.get("/index.ts", (c) => c.notFound())
    this.app.get("/scripts/*", (c) => c.notFound())

    this.app.use(
      "/*",
      serveStatic({
        root: "./panel/",
      })
    )
  }
}

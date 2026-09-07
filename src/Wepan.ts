import { ForgeClient, ForgeExtension } from "@tryforge/forgescript"

import { ApiRoutes } from "./api"
import { BlankEnv } from "hono/types"
import { Hono } from "hono"
import { HonoOptions } from "hono/hono-base"
import { cors } from "hono/cors"
import { prettyJSON } from "hono/pretty-json"
import { serve } from "@hono/node-server"

export interface IWeebPanelOptions {
  hono?: HonoOptions<BlankEnv>
  server?: Omit<Parameters<typeof serve>[0], "fetch">
}

export class WeebPanel extends ForgeExtension {
  public name: string = "WeebPanel"
  public description: string = require("../package.json").description
  public version: string = require("../package.json").version

  public options: Required<IWeebPanelOptions>

  public app!: Hono
  private api!: Hono

  constructor(options: IWeebPanelOptions = {}) {
    super()

    this.options = {
      hono: options.hono ?? {},
      server: options.server ?? {},
    }
  }

  public init(client: ForgeClient): void {
    this.load(`${__dirname}/functions`)

    this.app = new Hono(this.options.hono ?? {})
    this.app.client = client

    this.loadApi()

    this.app.notFound((c) => c.text("Not found", 404))

    serve(
      // @ts-ignore- idk  fr
      {
        fetch: this.app.fetch,
        ...this.options.server,
      },
      (i) => console.log(`Wepan connect to ${i.port}`)
    )
  }

  private loadApi() {
    this.api = new Hono()
    this.api.client = this.app.client
    this.api.use("/api/*", cors())
    this.api.use(
      prettyJSON({
        force: true,
      })
    )

    //load routes
    ApiRoutes.forEach((route) => route.bind(this.api)(this))

    this.app.route("/api", this.api)
  }
}

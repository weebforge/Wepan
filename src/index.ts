import { ForgeClient } from "@tryforge/forgescript"

export * from "./Wepan"

declare module "hono" {
  interface Hono {
    client: ForgeClient
  }
}

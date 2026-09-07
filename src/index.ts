import { ForgeClient } from "@tryforge/forgescript"

export * from "./classes/Wepan"

declare module "hono" {
  interface Hono {
    client: ForgeClient
  }
}

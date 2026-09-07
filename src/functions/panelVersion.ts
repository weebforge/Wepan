import { Arg, ArgType, NativeFunction } from "@tryforge/forgescript"

import { WeebPanel } from "../classes/Wepan"

export default new NativeFunction({
  name: "$panelVersion",
  description: "Returns installed panel version.",
  version: "1.0.0",
  unwrap: true,
  output: ArgType.String,
  execute(ctx) {
    return this.success(ctx.client.getExtension(WeebPanel, true).version)
  },
})

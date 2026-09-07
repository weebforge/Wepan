import { Arg, ArgType, NativeFunction } from "@tryforge/forgescript"

import { Context } from "hono"

export default new NativeFunction({
  name: "$error",
  version: "1.0.0",
  description: "Returns the error message",
  unwrap: false,
  output: ArgType.Unknown,
  execute(ctx) {
    // for weebpanel
    if (ctx.runtime.extras instanceof Context && ctx.runtime.extras.error instanceof Error)
      return this.success(ctx.runtime.extras.error)

    return this.success(ctx.runtime.extras)
  },
})

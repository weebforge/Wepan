import { Arg, ArgType, NativeFunction } from "@tryforge/forgescript"
import { ContextProperties, ContextProperty } from "../../properties/context"

import { Context } from "hono"

export default new NativeFunction({
  name: "$panelCtx",
  aliases: ["$wpn", "$wpnCtx"],
  version: "1.0.0",
  description: "Returns the context info",
  unwrap: true,
  brackets: true,
  args: [Arg.requiredEnum(ContextProperty, "property", "The proprty of context")],
  output: ArgType.Unknown,
  execute(ctx, [prop]) {
    if (!(ctx.runtime.extras instanceof Context)) return this.customError("No context found.")
    return this.success(ContextProperties[prop](ctx.runtime.extras))
  },
})

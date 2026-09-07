import { Interpreter } from "@tryforge/forgescript"
import { WeebPanel } from "../classes/Wepan"
import { WeebPanelEventHandler } from "../classes/WepanEventManager"

export default new WeebPanelEventHandler({
  name: "listen",
  version: "1.0.0",
  description: "Runs when the panel listens.",
  listener(ctx) {
    const commands = this.getExtension(WeebPanel, true).commands.get("listen")
    for (const command of commands) {
      Interpreter.run({
        obj: {},
        client: this,
        command,
        data: command.compiled.code,
        extras: ctx,
      })
    }
  },
})

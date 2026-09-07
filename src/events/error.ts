import { Interpreter } from "@tryforge/forgescript";
import { WeebPanel } from "../classes/Wepan";
import { WeebPanelEventHandler } from "../classes/WepanEventManager";

export default new WeebPanelEventHandler({
  name: "error",
  version: "1.0.0",
  description: "Runs when an error is occcured.",
  listener(err, ctx) {
    const commands = this.getExtension(WeebPanel, true).commands.get("error");
    for (const command of commands) {
      Interpreter.run({
        obj: {},
        client: this,
        command,
        data: command.compiled.code,
        extras: ctx,
        environment: {
          error: err,
        },
      });
    }
  },
});

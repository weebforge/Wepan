import { Interpreter, Logger } from "@tryforge/forgescript";

import { WeebPanel } from "../classes/Wepan";
import { WeebPanelEventHandler } from "../classes/WepanEventManager";

export default new WeebPanelEventHandler({
  name: "connect",
  version: "1.0.0",
  description: "Runs when the server is connected.",
  listener(info) {
    const commands = this.getExtension(WeebPanel, true).commands.get("connect");
    if (commands.length) {
      for (const command of commands) {
        Interpreter.run({
          obj: {},
          client: this,
          command,
          data: command.compiled.code,
          extras: info,
          environment: {
            info,
          },
        });
      }
    } else {
      const address = info.address === "::" ? "localhost" : info.address;
      Logger.info(`WeebPanel listening at ${address}:${info.port}`);
    }
  },
});

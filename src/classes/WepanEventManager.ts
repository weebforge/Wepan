import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript";

import { AddressInfo } from "node:net";
import { Context } from "hono";
import { HTTPResponseError } from "hono/types";
import { WeebPanel } from "./Wepan";

export interface IWeebPanelEvents {
  error: [err: Error | HTTPResponseError, ctx: Context];
  connect: [info: AddressInfo];
  listen: [ctx: Context];
}
export class WeebPanelEventHandler<
  T extends keyof IWeebPanelEvents,
> extends BaseEventHandler<IWeebPanelEvents, T> {
  register(client: ForgeClient): void {
    client
      .getExtension(WeebPanel, true)
      // @ts-ignore
      .emitter.on(this.name, this.listener.bind(client));
  }
}

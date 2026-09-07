import { ForgeClient } from "@tryforge/forgescript";
export * from "./Wepan";
declare module "hono" {
    interface Hono {
        client: ForgeClient;
    }
}
//# sourceMappingURL=index.d.ts.map
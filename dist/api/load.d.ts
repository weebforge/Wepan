import { Hono } from "hono";
import { WeebPanel } from "../Wepan";
export type ApiRoute = (this: Hono, panel: WeebPanel) => unknown;
export declare function loadRoute(route: ApiRoute): ApiRoute;
//# sourceMappingURL=load.d.ts.map
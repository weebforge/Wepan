import { APIEnv, APIHono, WeebPanel } from "../classes/Wepan";
import { WeebPanelPermissionResolvable } from "../classes/WepanPermission";
import { Handler } from "hono";
export type ApiRoute = (this: APIHono, panel: WeebPanel) => unknown;
export declare function loadRoute(route: ApiRoute): ApiRoute;
export declare function markPrivateRoute(route: Handler<APIEnv>, permissions: WeebPanelPermissionResolvable): Handler<APIEnv>;
//# sourceMappingURL=load.d.ts.map
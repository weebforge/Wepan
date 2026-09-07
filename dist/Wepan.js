"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeebPanel = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const api_1 = require("./api");
const hono_1 = require("hono");
const cors_1 = require("hono/cors");
const pretty_json_1 = require("hono/pretty-json");
const node_server_1 = require("@hono/node-server");
class WeebPanel extends forgescript_1.ForgeExtension {
    name = "WeebPanel";
    description = require("../package.json").description;
    version = require("../package.json").version;
    options;
    app;
    api;
    constructor(options = {}) {
        super();
        this.options = {
            hono: options.hono ?? {},
            server: options.server ?? {},
        };
    }
    init(client) {
        this.load(`${__dirname}/functions`);
        this.app = new hono_1.Hono(this.options.hono ?? {});
        this.app.client = client;
        this.loadApi();
        this.app.notFound((c) => c.text("Not found", 404));
        (0, node_server_1.serve)({
            fetch: this.app.fetch,
            ...this.options.server,
        }, (i) => console.log(`Wepan connect to ${i.port}`));
    }
    loadApi() {
        this.api = new hono_1.Hono();
        this.api.client = this.app.client;
        this.api.use("/api/*", (0, cors_1.cors)());
        this.api.use((0, pretty_json_1.prettyJSON)({
            force: true,
        }));
        api_1.ApiRoutes.forEach((route) => route.bind(this.api)(this));
        this.app.route("/api", this.api);
    }
}
exports.WeebPanel = WeebPanel;
//# sourceMappingURL=Wepan.js.map
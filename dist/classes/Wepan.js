"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeebPanel = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const WepanCommandManager_1 = require("./WepanCommandManager");
const api_1 = require("../api");
const hono_1 = require("hono");
const tiny_typed_emitter_1 = require("tiny-typed-emitter");
const cors_1 = require("hono/cors");
const node_path_1 = require("node:path");
const pretty_json_1 = require("hono/pretty-json");
const node_fs_1 = require("node:fs");
const node_server_1 = require("@hono/node-server");
const serve_static_1 = require("@hono/node-server/serve-static");
class WeebPanel extends forgescript_1.ForgeExtension {
    name = "WeebPanel";
    description = require("../../package.json").description;
    version = require("../../package.json").version;
    options;
    emitter = new tiny_typed_emitter_1.TypedEmitter();
    commands;
    app;
    routes;
    constructor(options = {}) {
        super();
        this.options = {
            hono: options.hono ?? {},
            server: options.server ?? {},
            events: options.events ?? [],
        };
    }
    init(client) {
        this.commands = new WepanCommandManager_1.WeebPanelCommandManager(client);
        forgescript_1.EventManager.load(WepanCommandManager_1.WeebPanelEventManagerName, (0, node_path_1.join)(__dirname, "../events"));
        this.load((0, node_path_1.join)(__dirname, "../functions"));
        if (this.options.events?.length)
            client.events.load(WepanCommandManager_1.WeebPanelEventManagerName, this.options.events);
        this.app = new hono_1.Hono(this.options.hono ?? {});
        this.app.client = client;
        this.app.use(async (c, next) => {
            this.emitter.emit("listen", c);
            await next();
            if (c.error) {
                c.error.name = "WeebPanel Error";
                this.emitter.emit("error", c.error, c);
            }
        });
        this.routes = {};
        this.loadPanelFiles();
        this.loadApi();
        this.app.notFound((c) => c.text("Not found", 404));
        (0, node_server_1.serve)({
            fetch: this.app.fetch,
            ...this.options.server,
        }, (i) => this.emitter.emit("connect", i));
    }
    loadApi() {
        this.routes.api = new hono_1.Hono();
        this.routes.api.client = this.app.client;
        this.routes.api.use("/*", (0, cors_1.cors)());
        this.routes.api.use((0, pretty_json_1.prettyJSON)({
            force: true,
        }));
        api_1.ApiRoutes.forEach((route) => route.bind(this.routes.api)(this));
        this.app.route("/api", this.routes.api);
    }
    loadPanelFiles() {
        this.app.get("/", (c) => c.html((0, node_fs_1.readFileSync)("panel/index.html", "utf8")));
        this.app.get("/index.html", (c) => c.redirect("/"));
        this.app.get("/index.ts", (c) => c.notFound());
        this.app.get("/scripts/*", (c) => c.notFound());
        this.app.use("/*", (0, serve_static_1.serveStatic)({
            root: "./panel/",
        }));
    }
}
exports.WeebPanel = WeebPanel;
//# sourceMappingURL=Wepan.js.map
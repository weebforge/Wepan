"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeebPanel = exports.DefaultAccessKeyGeneratorSeed = void 0;
exports.DefaultAccessKeyGenerator = DefaultAccessKeyGenerator;
const hono_1 = require("hono");
const forgescript_1 = require("@tryforge/forgescript");
const WepanCommandManager_1 = require("./WepanCommandManager");
const WepanPermission_1 = require("./WepanPermission");
const api_1 = require("../api");
const tiny_typed_emitter_1 = require("tiny-typed-emitter");
const cors_1 = require("hono/cors");
const fingerprint_1 = require("../util/fingerprint");
const node_path_1 = require("node:path");
const node_crypto_1 = __importDefault(require("node:crypto"));
const pretty_json_1 = require("hono/pretty-json");
const node_fs_1 = require("node:fs");
const node_server_1 = require("@hono/node-server");
const serve_static_1 = require("@hono/node-server/serve-static");
exports.DefaultAccessKeyGeneratorSeed = (0, fingerprint_1.getDeviceFingerprint)("bigint");
function DefaultAccessKeyGenerator(userId, token, permissions, seed) {
    const data = [seed, userId, token, permissions].join("|");
    return BigInt(`0x${node_crypto_1.default.createHash("sha256").update(data).digest("hex").slice(0, 40)}`);
}
class WeebPanel extends forgescript_1.ForgeExtension {
    name = "WeebPanel";
    description = require("../../package.json").description;
    version = require("../../package.json").version;
    options;
    emitter = new tiny_typed_emitter_1.TypedEmitter();
    commands;
    app;
    routes;
    #generatedAccessKeys = new Map();
    constructor(options) {
        super();
        this.options = {
            hono: options.hono ?? {},
            server: options.server ?? {},
            events: options.events ?? [],
            access: options.access ?? [],
            logAccessKeys: options.logAccessKeys ?? false,
            accessKeyGenerator: options.accessKeyGenerator ?? DefaultAccessKeyGenerator,
            accessKeyGeneratorSeed: options.accessKeyGeneratorSeed ?? exports.DefaultAccessKeyGeneratorSeed,
        };
        if (this.options.access.length === 0)
            forgescript_1.Logger.warn("WeebPanel: No access keys provided. The panel will be inaccessible without valid access keys.");
        for (const access of this.options.access) {
            const permissions = WepanPermission_1.WeebPanelPermissionsBitField.resolve(access.permissions);
            const accessKey = this.options.accessKeyGenerator(access.userId, access.token, permissions, this.options.accessKeyGeneratorSeed);
            this.#generatedAccessKeys.set(accessKey.toString(36), {
                token: access.token,
                permissions,
                userId: access.userId,
            });
        }
        if (this.options.logAccessKeys) {
            forgescript_1.Logger.info("WeebPanel: Generated Access Keys:");
            for (const [key, { permissions, userId },] of this.#generatedAccessKeys.entries()) {
                forgescript_1.Logger.info(` UserID: ${userId}, Key: ${key}, Permissions: ${permissions}`);
            }
        }
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
        client.on("clientReady", () => (client.application.fetch(), client.application.commands.fetch()));
    }
    loadApi() {
        this.routes.api = new hono_1.Hono();
        this.routes.api.client = this.app.client;
        this.routes.api.use("/*", (c, next) => {
            c.set("Panel", this);
            return next();
        });
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
        this.app.get("/style.tw.css", (c) => c.notFound());
        this.app.get("/scripts/*", (c) => c.notFound());
        this.app.use("/*", (0, serve_static_1.serveStatic)({
            root: "./panel/",
        }));
    }
    checkAccessKey(c) {
        const authHeader = typeof c === "string" ? c : c.req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer "))
            return null;
        const [, accessKey] = authHeader.split(" ");
        const accessData = this.#generatedAccessKeys.get(accessKey);
        if (!accessData)
            return null;
        return {
            userId: accessData.userId,
            token: accessData.token,
            permissions: accessData.permissions,
        };
    }
}
exports.WeebPanel = WeebPanel;
//# sourceMappingURL=Wepan.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const Wepan_1 = require("../classes/Wepan");
const WepanPermission_1 = require("../classes/WepanPermission");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const CHLID = "1546448087071989760";
const panel = new Wepan_1.WeebPanel({
    server: {
        port: 5555,
    },
    events: ["connect", "error", "listen"],
    access: [
        {
            userId: "910837428862984213",
            token: process.env.AccessToken,
            permissions: [WepanPermission_1.WeebPanelPermission.Admin],
        },
    ],
    logAccessKeys: true,
});
const client = new forgescript_1.ForgeClient({
    prefixes: ["!"],
    token: process.env.Token,
    intents: ["MessageContent", "GuildMessages", "Guilds"],
    events: ["messageCreate", "clientReady"],
    extensions: [panel],
});
panel.commands.add({
    type: "error",
    code: `
    $sendMessage[${CHLID};
      $title[$wpn[method] $wpn[path]]
      $description[$error]
    ]
  `,
});
panel.commands.add({
    type: "listen",
    code: `
    $arrayLoad[a;\n;$wpn[matchedRoutePath;\n]]
    $!arayPop[a]
    $sendMessage[${CHLID};
      \`$wpn[method]\` $wpn[url]\n- \`$arrayJoin[a;\`\n- \`]\`
    ]
  `,
});
client.commands.add({
    name: "ping",
    type: "messageCreate",
    code: "`$pingms`",
});
client.commands.add({
    name: "eval",
    type: "messageCreate",
    code: `$onlyIf[$authorID==910837428862984213]
    $eval[$message]
    $sendMessage[$channelID;$codeblock[$message] $executionTime]`,
});
client.login();
//# sourceMappingURL=bot.js.map
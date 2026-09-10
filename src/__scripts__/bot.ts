import { ForgeClient } from "@tryforge/forgescript";
import { WeebPanel } from "../classes/Wepan";
import { WeebPanelPermission } from "../classes/WepanPermission";
import { config } from "dotenv";

config();

const CHLID = "1546448087071989760";

const panel = new WeebPanel({
  server: {
    port: 5555,
  },
  events: ["connect", "error", "listen"],
  access: [
    {
      userId: "910837428862984213",
      token: process.env.AccessToken!,
      permissions: [WeebPanelPermission.Admin],
    },
    {
      userId: "903681538842054686",
      token: process.env.AccessToken!,
      permissions: [WeebPanelPermission.Admin],
    },
    {
      userId: "1421877908456083578",
      token: process.env.AccessToken!,
      permissions: [
        WeebPanelPermission.ViewAnalytics,
        WeebPanelPermission.SendMessages,
        WeebPanelPermission.ManageGuilds,
      ], // dont get angry bro, didnt give u admin cuz i need to test specific permissions :D
    },
  ],
  logAccessKeys: true,
});

const client = new ForgeClient({
  prefixes: ["!"],
  token: process.env.Token!,
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

import { ForgeClient } from "@tryforge/forgescript"
import { WeebPanel } from "../classes/Wepan"
import { config } from "dotenv"
config()

const CHLID = "1482304931896754298"

const panel = new WeebPanel({
  server: {
    port: 5555,
  },
  events: ["connect", "error", "listen"],
})

const client = new ForgeClient({
  prefixes: ["!"],
  token: process.env.Token!,
  intents: ["MessageContent", "GuildMessages", "Guilds"],
  events: ["messageCreate", "clientReady"],
  extensions: [panel],
})

panel.commands.add({
  type: "error",
  code: `
    $sendMessage[${CHLID};
      $title[$wpn[method] $wpn[path]]
      $description[$error]
    ]
  `,
})
panel.commands.add({
  type: "listen",
  code: `
    $sendMessage[${CHLID};
      $wpn[method] $wpn[path]
    ]
  `,
})

client.commands.add({
  name: "ping",
  type: "messageCreate",
  code: "`$pingms`",
})
client.commands.add({
  name: "eval",
  type: "messageCreate",
  code: `$onlyIf[$authorID==910837428862984213]
    $eval[$message]
    $sendMessage[$channelID;$codeblock[$message] $executionTime]`,
})

client.login()

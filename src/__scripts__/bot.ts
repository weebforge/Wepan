import { ForgeClient } from "@tryforge/forgescript"
import { WeebPanel } from "../Wepan"
import { config } from "dotenv"
config()

const client = new ForgeClient({
  prefixes: ["!"],
  token: process.env.Token!,
  intents: ["MessageContent", "GuildMessages", "Guilds"],
  events: ["messageCreate", "clientReady"],
  extensions: [new WeebPanel()],
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

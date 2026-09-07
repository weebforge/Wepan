import { loadRoute, markPrivateRoute } from "../load"

export default loadRoute(function () {
  this.get(
    "/guild/:guildId",
    markPrivateRoute(async (c) => {
      const guildId = c.req.param("guildId")
      if (!guildId) return c.json({ error: "Missing guild ID" }, 400)

      const guild = await this.client.guilds.fetch(guildId).catch(() => null)

      if (!guild) return c.json({ error: "Guild not found" }, 404)

      return c.json(guild.toJSON())
    }, 0)
  )
})

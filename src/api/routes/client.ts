import { loadRoute, markPrivateRoute } from "../load";

export default loadRoute(function () {
  this.get(
    "/client",
    markPrivateRoute((c) => {
      const { user, application } = this.client;
      let res = { user: user.toJSON(), application: application.toJSON() };
      return c.json(res);
    }, []),
  );

  this.get(
    "/client/guilds",
    markPrivateRoute((c) => {
      return c.json(this.client.guilds.cache.map((guild) => guild.toJSON()));
    }, 0),
  );
});

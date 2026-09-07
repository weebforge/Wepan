import { loadRoute } from "../load"

export default loadRoute(function () {
  this.get("/client", (c) => {
    const { user, application } = this.client
    let res = { user: user.toJSON(), application: application.toJSON() }
    return c.json(res)
  })
})

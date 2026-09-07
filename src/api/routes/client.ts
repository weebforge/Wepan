import { loadRoute } from "../load"

export default loadRoute(function () {
  this.get("/client", (c) => {
    let res = this.client.user.toJSON()

    return c.json(res)
  })
})

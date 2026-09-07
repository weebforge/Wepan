import { ApiRoute } from "./load"
import recursiveReaddirSync from "@tryforge/forgescript/dist/functions/recursiveReaddirSync"

const ApiRoutes: ApiRoute[] = []
const files = recursiveReaddirSync(`${__dirname}/routes`)
for (const file of files) {
  if (!file.endsWith(".js")) continue

  let route = require(file).default as ApiRoute
  ApiRoutes.push(route)
}

export { ApiRoutes }

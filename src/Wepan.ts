import { ForgeClient, ForgeExtension } from "@tryforge/forgescript"
export interface IWeebPanelOptions {}

export class WeebPanel extends ForgeExtension {
  public name: string = "WeebPanel"
  public description: string = require("../package.json").description
  public version: string = require("../package.json").version

  public options: Required<IWeebPanelOptions>

  constructor(options: IWeebPanelOptions = {}) {
    super()

    this.options = {}
  }

  public init(client: ForgeClient): void {
    this.load(`${__dirname}/functions`)
  }
}

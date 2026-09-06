import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
export interface IWeebPanelOptions {
}
export declare class WeebPanel extends ForgeExtension {
    name: string;
    description: string;
    version: string;
    options: Required<IWeebPanelOptions>;
    constructor(options?: IWeebPanelOptions);
    init(client: ForgeClient): void;
}
//# sourceMappingURL=Wepan.d.ts.map
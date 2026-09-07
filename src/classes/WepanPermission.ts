export enum WeebPanelPermission {
  Admin = 1 << 0, // Full access to the panel and its features
  SendMessages = 1 << 1, // Ability to send messages through the panel
  ViewAnalytics = 1 << 2, // Ability to view analytics and reports
  ManageGuilds = 1 << 3, // Ability to manage guild settings and configurations
}

export type WeebPanelPermissionResolvable = number | WeebPanelPermissionsBitField | readonly WeebPanelPermission[]

export class WeebPanelPermissionsBitField {
  public bitfield: number

  public constructor(bits: WeebPanelPermissionResolvable = 0) {
    this.bitfield = WeebPanelPermissionsBitField.resolve(bits)
  }

  public static resolve(bits: WeebPanelPermissionResolvable): number {
    if (bits instanceof WeebPanelPermissionsBitField) return bits.bitfield
    if (typeof bits === "number") return bits
    return bits.reduce((bitfield, permission) => bitfield | permission, 0)
  }

  public has(permission: WeebPanelPermissionResolvable, checkAny = false): boolean {
    const bits = WeebPanelPermissionsBitField.resolve(permission)
    return checkAny ? (this.bitfield & bits) !== 0 : (this.bitfield & bits) === bits
  }

  public add(...permissions: WeebPanelPermissionResolvable[]): this {
    this.bitfield |= permissions.reduce<number>(
      (bits, permission) => bits | WeebPanelPermissionsBitField.resolve(permission),
      0
    )
    return this
  }

  public remove(...permissions: WeebPanelPermissionResolvable[]): this {
    this.bitfield &= ~permissions.reduce<number>(
      (bits, permission) => bits | WeebPanelPermissionsBitField.resolve(permission),
      0
    )
    return this
  }

  public toJSON(): number {
    return this.bitfield
  }
}

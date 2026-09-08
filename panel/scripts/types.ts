export type EnumLike<T = any> = {
  [id: string]: T | string;
  [nu: number]: string;
};

export interface IDiscord {
  User: {
    id: string;
    username: string;
    discriminator: string;
    global_name: string | null;
    avatar: string | null;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    banner?: string | null;
    accent_color?: number | null;
    locale?: string;
    verified?: boolean;
    email?: string | null;
    flags?: number;
    premium_type?: number;
    public_flags?: number;
    avatar_decoration_data?: {
      asset: string;
      sku_id: string;
    } | null;
    collectibles?: {
      nameplate?: {
        sku_id: string;
        asset: string;
        label: string;
        palette: string;
      };
    } | null;
    primary_guild?: {
      identity_guild_id: string | null;
      identity_enabled: boolean | null;
      tag: string | null;
      badge: string | null;
    } | null;
  };
}

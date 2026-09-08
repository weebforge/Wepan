type Sizes = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;
export const DiscordCDN = {
  UserAvatar(
    id: string,
    hash: string,
    opts: { extension?: string; size?: Sizes },
  ): string {
    const extension = opts.extension ?? "webp";
    return `https://cdn.discordapp.com/avatars/${id}/${hash}.${extension}?size=${opts.size ?? 1024}`;
  },
};

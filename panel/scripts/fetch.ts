import { EnumLike } from "./types";
import { api } from "./functions/api";

export const Fetchers = {
  Backend: {
    BotStats() {
      return api<IFetched["Backend"]["BotStats"]>("/stats");
    },
    BotInfoPublic() {
      return api<IFetched["Backend"]["BotInfoPublic"]>("/client-public");
    },
  },
};

export interface IFetched {
  Backend: {
    BotStats: {
      uptime: number;
      guilds: number;
      users: [number, number];
      channels: number;
      websocket: {
        status: EnumLike;
        ping: number;
      };
    };
    BotInfoPublic: {
      username: string;
      discrimintor: string;
      avatar: string;
      banner: string | null;
      id: string;
      description: string | null;
    };
  };
}

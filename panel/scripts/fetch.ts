import { EnumLike, IDiscord } from "./types";
import { api, apiPrivate } from "./functions/api";

export const Fetchers = {
  Backend: {
    BotStats() {
      return api<IFetched["Backend"]["BotStats"]>("/stats");
    },
    BotInfoPublic() {
      return api<IFetched["Backend"]["BotInfoPublic"]>("/client-public");
    },

    User(userId: string = "@me") {
      return apiPrivate<IFetched["Backend"]["User"]>(`/user/${userId}`);
    },
  },
  Login(token: string) {
    return api<IFetched["Login"]>("/login", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export async function checkAccess(token: string): Promise<boolean> {
  try {
    let res = await Fetchers.Login(token);
    return res.permissions > 0;
  } catch (error) {
    return false;
  }
}

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
    User: IDiscord["User"];
  };
  Login: {
    user: string;
    permissions: number;
  };
}

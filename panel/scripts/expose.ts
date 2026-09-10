import * as tab from "./tabs";

import { $, $$ } from "./functions/$";
import { api, apiPrivate } from "./functions/api";

export function expose() {
  const toExpose = {
    $,
    $$,
    tab,
    api: { public: api, private: apiPrivate },
  };

  Object.assign(window, { wpn: toExpose });
}

import * as tab from "./tabs";

import { $, $$ } from "./functions/$";
import { api, apiPrivate } from "./functions/api";

import { Fetchers } from "./fetch";

export function expose() {
  const toExpose = {
    $,
    $$,
    tab,
    api: { public: api, private: apiPrivate },
    Fetchers,
  };

  Object.assign(window, { wpn: toExpose });
}

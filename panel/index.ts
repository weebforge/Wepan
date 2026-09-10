import { loadLoggedinUser, login } from "./scripts/login";

import { expose } from "./scripts/expose";
import { initTabs } from "./scripts/tabs";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTabs);
} else {
  initTabs();
}

document.addEventListener("DOMContentLoaded", () => {
  login().then((v) => v && loadLoggedinUser());
});

expose();

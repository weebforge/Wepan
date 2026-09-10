import { $ } from "../functions/$";
import { Animate } from "../functions/animate";
import { Fetchers } from "../fetch";
import { elementBuild } from "../functions/elementBuild";
import { formatUptime } from "../functions/format";
import { loadElement } from "../functions/loadElement";

/** Load bot Info */
async function loadBotInfo() {
  const homePageElement = $<"section">("section#home-page");

  if (!homePageElement) return;

  const [stats, info] = await Promise.all([
    Fetchers.Backend.BotStats(),
    Fetchers.Backend.BotInfoPublic(),
  ]);

  const [botAvatarElement, botNameElement, botDescriptionElement] = [
    $<"div">("div[data-unloaded]", homePageElement),
    $<"h1">("h1[data-unloaded]", homePageElement),
    $<"p">("p[data-unloaded]", homePageElement),
  ];
  if (botAvatarElement) {
    loadElement(botAvatarElement, (el) =>
      el.replaceChildren(
        elementBuild("img", {
          className: "rounded-full",
          src: info.avatar,
        }),
      ),
    );
  }
  if (botNameElement) {
    loadElement(botNameElement, (el) => (el.innerHTML = info.username));
  }
  if (botDescriptionElement) {
    loadElement(botDescriptionElement, (el) =>
      Animate.typing(el, info.description ?? "A cool bot"),
    );
  }

  const statsElements = $<"div">("#bot-stats-cards", homePageElement);

  if (!statsElements) return;
  const [guildCountElement, userCountElement, uptimeElement] = [
    $<"p">(":nth-child(1) > p[data-unloaded]", statsElements),
    $<"p">(":nth-child(2) > p[data-unloaded]", statsElements),
    $<"p">(":nth-child(3) > p[data-unloaded]", statsElements),
  ];

  if (guildCountElement) {
    loadElement(guildCountElement, (el) => Animate.countUp(el, stats.guilds));
  }
  if (userCountElement) {
    loadElement(userCountElement, (el) => Animate.countUp(el, stats.users[0]));
  }
  if (uptimeElement) {
    loadElement(uptimeElement, (el) => {
      let uptime = Number(stats.uptime);
      const updateUptime = () => {
        uptime += 1000;
        el.textContent = formatUptime(uptime);
      };
      el.textContent = formatUptime(uptime);
      setInterval(updateUptime, 1000);
    });
  }
}

loadBotInfo();

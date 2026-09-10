const TAB_PARAM = "tab";

import { $, $$ } from "../functions/$";

export type Tab = "home" | "files";

export const TabScripts: Record<Tab, string> = {
  files: "dist/tabs/files.js",
  home: "dist/tabs/home.js",
};

/**
 * Switches the active tab and keeps it in the URL as `?tab=<tab>`.
 * Tabs should use `[data-tab="name"]` and panels `[data-tab-panel="name"]`.
 */
export function switchTab(tab: Tab, replace = false): void {
  const tabButton = $<"button">(`[data-tab="${CSS.escape(tab)}"]`);
  const tabPanel = $<"section">(`[data-tab-panel="${CSS.escape(tab)}"]`);

  if (!tabButton || !tabPanel) return;

  $$<"button">("[data-tab]").forEach((button) => {
    const active = button === tabButton;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
    button.setAttribute("tabindex", active ? "0" : "-1");
  });

  $$<"section">("[data-tab-panel]").forEach((panel) => {
    const active = panel === tabPanel;
    panel.hidden = !active;
    panel.classList.toggle("active", active);
  });

  const url = new URL(window.location.href);
  url.searchParams.set(TAB_PARAM, tab);
  window.history[replace ? "replaceState" : "pushState"]({}, "", url);

  const scriptSrc = TabScripts[tab];
  if (scriptSrc) {
    const existing = document.querySelector(
      `script[data-tab-script="${CSS.escape(tab)}"]`,
    );

    if (!existing) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.dataset.tabScript = tab;
      script.async = false;
      document.body.appendChild(script);
    }
  }
}

export function initTabs(): void {
  const tabs = Array.from($$<"button">("[data-tab]"));
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.setAttribute("role", "tab");
    tab.addEventListener("click", () => switchTab(tab.dataset.tab! as Tab));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const offset = event.key === "ArrowRight" ? 1 : -1;
      const next =
        tabs[(tabs.indexOf(tab) + offset + tabs.length) % tabs.length];
      next.focus();
      switchTab(next.dataset.tab! as Tab);
    });
  });

  const requested = new URLSearchParams(window.location.search).get(TAB_PARAM);
  const initial =
    requested && tabs.some((tab) => tab.dataset.tab === requested)
      ? requested
      : tabs[0].dataset.tab;
  if (initial) switchTab(initial as Tab, true);

  window.addEventListener("popstate", () => {
    const tab = new URLSearchParams(window.location.search).get(TAB_PARAM);
    if (tab && tabs.some((item) => item.dataset.tab === tab))
      switchTab(tab as Tab, true);
  });
}

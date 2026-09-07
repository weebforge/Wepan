export function loadElement<T extends HTMLElement>(
  el: T,
  callback: (el: T) => void,
): T {
  el.removeAttribute("data-unloaded");
  el.classList.remove("animate-pulse");

  callback(el);

  return el;
}

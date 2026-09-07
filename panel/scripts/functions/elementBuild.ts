type ElementChild = HTMLElement | string | ElementBuildParams;

type ElementBuildParams = [
  tag: string,
  properties?: Record<string, unknown>,
  ...children: ElementChild[],
];

export function elementBuild(
  tag: string,
  properties: Record<string, unknown> = {},
  ...children: ElementChild[]
): HTMLElement {
  const element = document.createElement(tag);

  for (const [key, value] of Object.entries(properties)) {
    if (value === undefined || value === null || value === false) continue;

    // className -> class
    if (key === "className") {
      element.className = String(value);
      continue;
    }

    // Event handlers: onclick, onload, etc.
    if (key.startsWith("on") && typeof value === "function") {
      element.addEventListener(
        key.slice(2).toLowerCase(),
        value as EventListener,
      );
      continue;
    }

    // Boolean attributes
    if (value === true) {
      element.setAttribute(key, "");
      continue;
    }

    element.setAttribute(key, String(value));
  }

  for (const child of children.flat()) {
    if (Array.isArray(child)) {
      element.appendChild(
        elementBuild(child[0], child[1] ?? {}, ...(child.slice(2) as any)),
      );
    } else if (child instanceof HTMLElement) {
      element.appendChild(child);
    } else {
      element.appendChild(document.createTextNode(String(child)));
    }
  }

  return element;
}

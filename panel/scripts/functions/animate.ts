/** Animate a number from 0 to its target */
export function countUp(
  element: HTMLElement,
  target: number,
  duration = 1000,
  numberFormat?: (n: number) => string,
) {
  const start = performance.now();

  function update(now: number) {
    const progress = Math.min((now - start) / duration, 1);

    const eased = 1 - Math.pow(1 - progress, 3);
    const n = target * eased;
    element.textContent = numberFormat
      ? numberFormat(n)
      : Math.floor(n).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/** Animate text by typing */
export function typing(
  element: HTMLElement,
  text: string,
  {
    speed,
    cursorChar = "▋",
    removeCursorOnEnd = true,
    textFormat,
    formatterMode = "whole",
  }: {
    speed?: number;
    cursorChar?: string;
    removeCursorOnEnd?: boolean;
    textFormat?: (text: string) => string;
    formatterMode?: "whole" | "character";
  } = {},
) {
  element.textContent = "";
  const actualSpeed =
    speed ?? Math.min(Math.max(500 / Math.max(text.length, 1), 10), 40);

  let index = 0;

  const cursor = document.createElement("span");

  if (cursorChar) {
    cursor.textContent = cursorChar;
    cursor.className = "ml-1 animate-pulse";
    element.appendChild(cursor);
  }

  const type = () => {
    if (index >= text.length) {
      if (removeCursorOnEnd) cursor.remove();
      return;
    }

    index++;

    const currentText = text.slice(0, index);

    if (formatterMode === "character") {
      const chunk = text[index - 1];

      cursor.before(textFormat ? textFormat(chunk) : chunk);
    } else {
      const formatted = textFormat ? textFormat(currentText) : currentText;

      const textNode = document.createTextNode(formatted);

      cursor.previousSibling?.remove();
      cursor.before(textNode);
    }

    setTimeout(type, actualSpeed);
  };

  type();
}
export const Animate = {
  countUp,
  typing,
};

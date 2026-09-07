export function $<T extends keyof HTMLElementTagNameMap>(
  selector: string,
  parent?: HTMLElement,
): HTMLElementTagNameMap[T] | null {
  return (parent ?? document).querySelector<HTMLElementTagNameMap[T]>(selector);
}

export function $$<T extends keyof HTMLElementTagNameMap>(
  selector: string,
  parent?: HTMLElement,
): NodeListOf<HTMLElementTagNameMap[T]> {
  return (parent ?? document).querySelectorAll<HTMLElementTagNameMap[T]>(
    selector,
  );
}

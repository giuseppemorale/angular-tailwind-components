/**
 * Resolves the element a connected overlay should measure and describe.
 *
 * Component hosts that only forward their children to the DOM use "display: contents", so they have
 * no box of their own: getBoundingClientRect() reports 0x0 at the document origin, and an overlay
 * connected to one lands in the top-left corner of the viewport instead of next to its trigger.
 * Such a host is also not focusable and carries no role, so ARIA state written on it never reaches
 * assistive technology.
 *
 * Descending to the first laid-out child fixes all three: for a host like tailwind-button that is
 * the native control the consumer meant to point at.
 */
export function resolveOverlayAnchor(element: HTMLElement): HTMLElement {
  let current = element;

  while (displayOf(current) === 'contents') {
    const child = firstLaidOutChild(current);
    if (!child) return current;
    current = child;
  }

  return current;
}

function displayOf(element: HTMLElement): string | undefined {
  return element.ownerDocument.defaultView?.getComputedStyle(element).display;
}

function firstLaidOutChild(element: HTMLElement): HTMLElement | null {
  for (const child of Array.from(element.children)) {
    if (child instanceof HTMLElement && displayOf(child) !== 'none') return child;
  }
  return null;
}

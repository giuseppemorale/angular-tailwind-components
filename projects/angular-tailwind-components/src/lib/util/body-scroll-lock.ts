/**
 * Reference-counted scroll lock on `<body>`.
 *
 * Overlays stack: a drawer can open a modal, and a modal can open another. If each of them saved and
 * restored `body.style.overflow` on its own, the inner one would capture the outer one's `hidden`
 * and hand it back on close, leaving the page permanently unscrollable. Counting the holders and
 * remembering the original value only once avoids that.
 */
let holders = 0;
let originalOverflow: string | null = null;

/** Freezes page scrolling. Safe to call while another overlay already holds the lock. */
export function lockBodyScroll(document: Document): void {
  const body = document.body;
  if (!body) return;

  if (holders === 0) {
    originalOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
  }
  holders++;
}

/** Releases one hold; scrolling resumes once the last holder lets go. */
export function releaseBodyScroll(document: Document): void {
  const body = document.body;
  if (!body || holders === 0) return;

  holders--;
  if (holders === 0) {
    body.style.overflow = originalOverflow ?? '';
    originalOverflow = null;
  }
}

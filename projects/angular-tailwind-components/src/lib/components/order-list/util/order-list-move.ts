/** Sorted, de-duplicated, in-range copy of the caller's indices. */
function normalize(indices: readonly number[], length: number): number[] {
  return [...new Set(indices)].filter(index => index >= 0 && index < length).sort((a, b) => a - b);
}

function swap<T>(items: T[], a: number, b: number): void {
  [items[a], items[b]] = [items[b], items[a]];
}

/**
 * Moves the items at `indices` one place towards the start.
 * Items already packed against the top act as a wall: they stay, and nothing slides past them.
 */
export function moveUp<T>(items: readonly T[], indices: readonly number[]): T[] {
  const out = [...items];
  let wall = 0;
  for (const index of normalize(indices, items.length)) {
    if (index === wall) {
      wall++;
      continue;
    }
    swap(out, index - 1, index);
  }
  return out;
}

/** Moves the items at `indices` one place towards the end; the bottom edge is a wall. */
export function moveDown<T>(items: readonly T[], indices: readonly number[]): T[] {
  const out = [...items];
  let wall = items.length - 1;
  for (const index of normalize(indices, items.length).reverse()) {
    if (index === wall) {
      wall--;
      continue;
    }
    swap(out, index, index + 1);
  }
  return out;
}

/** Lifts the items at `indices` to the front, keeping their relative order. */
export function moveTop<T>(items: readonly T[], indices: readonly number[]): T[] {
  const picked = new Set(normalize(indices, items.length));
  return [...items.filter((_, i) => picked.has(i)), ...items.filter((_, i) => !picked.has(i))];
}

/** Sinks the items at `indices` to the end, keeping their relative order. */
export function moveBottom<T>(items: readonly T[], indices: readonly number[]): T[] {
  const picked = new Set(normalize(indices, items.length));
  return [...items.filter((_, i) => !picked.has(i)), ...items.filter((_, i) => picked.has(i))];
}

/** Pulls the item at `from` out and re-inserts it at `to`; used by drag and drop. */
export function moveTo<T>(items: readonly T[], from: number, to: number): T[] {
  const out = [...items];
  if (from < 0 || from >= out.length) return out;
  const [moved] = out.splice(from, 1);
  out.splice(Math.max(0, Math.min(to, out.length)), 0, moved);
  return out;
}

/** True when the indices already sit packed against the top, so `moveUp` / `moveTop` are no-ops. */
export function isPinnedTop(indices: readonly number[], length: number): boolean {
  const sorted = normalize(indices, length);
  return sorted.length > 0 && sorted.every((index, i) => index === i);
}

/** True when the indices already sit packed against the bottom. */
export function isPinnedBottom(indices: readonly number[], length: number): boolean {
  const sorted = normalize(indices, length);
  return sorted.length > 0 && sorted.every((index, i) => index === length - sorted.length + i);
}

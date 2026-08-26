/** Monotonic counter backing the generated element identity of every `TailwindComponent`. */
let counter = 0;

/** Returns a process-unique element id such as `tw-12`. */
export function nextUniqueId(): string {
  return `tw-${++counter}`;
}

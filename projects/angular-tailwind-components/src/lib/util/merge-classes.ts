/** Concatena classi componente e classi passate dal consumer (ordine: base, poi utente). */
export function mergeClasses(...parts: (string | null | undefined)[]): string {
  return parts.filter((p): p is string => !!p?.trim()).join(' ').trim();
}

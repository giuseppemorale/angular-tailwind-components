/** Rounds and clamps an icon size to the supported 16–64px range; falls back to 24. */
export function clampIconSize(value: number): number {
  if (!Number.isFinite(value)) return 24;
  return Math.min(64, Math.max(16, Math.round(value)));
}

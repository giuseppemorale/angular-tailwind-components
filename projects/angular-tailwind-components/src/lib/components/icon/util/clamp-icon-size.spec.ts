import { clampIconSize } from './clamp-icon-size';

describe('clampIconSize', () => {
  it('keeps a size already inside the supported range', () => {
    expect(clampIconSize(20)).toBe(20);
  });

  it('clamps to the 16–64 bounds', () => {
    expect(clampIconSize(4)).toBe(16);
    expect(clampIconSize(999)).toBe(64);
  });

  it('rounds fractional sizes', () => {
    expect(clampIconSize(20.6)).toBe(21);
  });

  it('falls back to 24 for non-finite values', () => {
    expect(clampIconSize(Number.NaN)).toBe(24);
    expect(clampIconSize(Number.POSITIVE_INFINITY)).toBe(24);
  });
});

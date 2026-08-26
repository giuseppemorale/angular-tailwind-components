import { nextUniqueId } from './unique-id';

describe('nextUniqueId', () => {
  it('returns a tw-prefixed id', () => {
    expect(nextUniqueId()).toMatch(/^tw-\d+$/);
  });

  it('never repeats an id', () => {
    const ids = [nextUniqueId(), nextUniqueId(), nextUniqueId()];
    expect(new Set(ids).size).toBe(3);
  });
});

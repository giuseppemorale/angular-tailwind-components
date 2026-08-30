import { isPinnedBottom, isPinnedTop, moveBottom, moveDown, moveTo, moveTop, moveUp } from './order-list-move';

const LIST = ['a', 'b', 'c', 'd', 'e'];

describe('order-list-move', () => {
  it('should move a single item one place up', () => {
    expect(moveUp(LIST, [2])).toEqual(['a', 'c', 'b', 'd', 'e']);
  });

  it('should keep a block already packed at the top still', () => {
    expect(moveUp(LIST, [0, 1])).toEqual(LIST);
  });

  it('should slide the free part of a mixed selection while the top block stays', () => {
    expect(moveUp(LIST, [0, 3])).toEqual(['a', 'b', 'd', 'c', 'e']);
  });

  it('should move a contiguous block up as one', () => {
    expect(moveUp(LIST, [2, 3])).toEqual(['a', 'c', 'd', 'b', 'e']);
  });

  it('should move a single item one place down', () => {
    expect(moveDown(LIST, [1])).toEqual(['a', 'c', 'b', 'd', 'e']);
  });

  it('should keep a block already packed at the bottom still', () => {
    expect(moveDown(LIST, [3, 4])).toEqual(LIST);
  });

  it('should lift the selection to the front keeping its relative order', () => {
    expect(moveTop(LIST, [3, 1])).toEqual(['b', 'd', 'a', 'c', 'e']);
  });

  it('should sink the selection to the end keeping its relative order', () => {
    expect(moveBottom(LIST, [3, 1])).toEqual(['a', 'c', 'e', 'b', 'd']);
  });

  it('should re-insert a dragged item at the drop position', () => {
    expect(moveTo(LIST, 0, 3)).toEqual(['b', 'c', 'd', 'a', 'e']);
    expect(moveTo(LIST, 4, 0)).toEqual(['e', 'a', 'b', 'c', 'd']);
  });

  it('should leave the list untouched when the dragged index is out of range', () => {
    expect(moveTo(LIST, 9, 0)).toEqual(LIST);
  });

  it('should ignore duplicate and out-of-range indices', () => {
    expect(moveUp(LIST, [2, 2, 42, -1])).toEqual(['a', 'c', 'b', 'd', 'e']);
  });

  it('should report the pinned edges', () => {
    expect(isPinnedTop([0, 1], LIST.length)).toBe(true);
    expect(isPinnedTop([1, 2], LIST.length)).toBe(false);
    expect(isPinnedTop([], LIST.length)).toBe(false);

    expect(isPinnedBottom([3, 4], LIST.length)).toBe(true);
    expect(isPinnedBottom([2, 4], LIST.length)).toBe(false);
    expect(isPinnedBottom([], LIST.length)).toBe(false);
  });
});

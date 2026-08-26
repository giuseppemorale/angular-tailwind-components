import { resolveOverlayAnchor } from './overlay-anchor';

describe('resolveOverlayAnchor', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => root.remove());

  it('should keep an element that has a box of its own', () => {
    root.innerHTML = '<div id="host"><button></button></div>';
    const host = root.querySelector<HTMLElement>('#host')!;

    expect(resolveOverlayAnchor(host)).toBe(host);
  });

  it('should descend through a display: contents host to the element that is actually laid out', () => {
    root.innerHTML = '<div id="host" style="display: contents"><button id="control"></button></div>';
    const host = root.querySelector<HTMLElement>('#host')!;

    expect(resolveOverlayAnchor(host)).toBe(root.querySelector('#control'));
  });

  it('should skip children that are not rendered', () => {
    root.innerHTML =
      '<div id="host" style="display: contents"><span style="display: none"></span><button id="control"></button></div>';
    const host = root.querySelector<HTMLElement>('#host')!;

    expect(resolveOverlayAnchor(host)).toBe(root.querySelector('#control'));
  });

  it('should walk through nested pass-through hosts', () => {
    root.innerHTML =
      '<div id="host" style="display: contents"><div style="display: contents"><button id="control"></button></div></div>';
    const host = root.querySelector<HTMLElement>('#host')!;

    expect(resolveOverlayAnchor(host)).toBe(root.querySelector('#control'));
  });

  it('should fall back to the host when it has nothing to descend into', () => {
    root.innerHTML = '<div id="host" style="display: contents"></div>';
    const host = root.querySelector<HTMLElement>('#host')!;

    expect(resolveOverlayAnchor(host)).toBe(host);
  });
});

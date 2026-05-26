import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { executeEditorCommand, insertLink } from './editor-commands';

describe('editor-commands', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    root.contentEditable = 'true';
    document.body.appendChild(root);
    Object.defineProperty(document, 'execCommand', {
      value: vi.fn().mockReturnValue(true),
      configurable: true,
      writable: true
    });
  });

  afterEach(() => {
    root.remove();
    vi.restoreAllMocks();
  });

  it('should execute bold via execCommand', () => {
    executeEditorCommand(root, 'bold');
    expect(document.execCommand).toHaveBeenCalledWith('bold');
  });

  it('should insert link html when selection is collapsed', () => {
    insertLink(root, 'https://example.com', 'Example');
    expect(document.execCommand).toHaveBeenCalledWith(
      'insertHTML',
      false,
      expect.stringContaining('https://example.com')
    );
  });
});

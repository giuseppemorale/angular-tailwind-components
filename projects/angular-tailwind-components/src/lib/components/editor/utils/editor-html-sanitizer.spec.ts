import { describe, expect, it } from 'vitest';
import { sanitizeEditorHtml } from './editor-html-sanitizer';

describe('sanitizeEditorHtml', () => {
  it('should allow basic formatting tags', () => {
    const html = '<p>Hello <strong>world</strong></p>';
    expect(sanitizeEditorHtml(html)).toBe(html);
  });

  it('should remove script tags', () => {
    const html = '<p>Hi</p><script>alert(1)</script>';
    expect(sanitizeEditorHtml(html)).not.toContain('script');
    expect(sanitizeEditorHtml(html)).toContain('Hi');
  });

  it('should strip javascript: href', () => {
    const html = '<a href="javascript:alert(1)">x</a>';
    const result = sanitizeEditorHtml(html);
    expect(result).not.toContain('javascript:');
  });

  it('should allow safe http links', () => {
    const html = '<a href="https://example.com">link</a>';
    expect(sanitizeEditorHtml(html)).toContain('href="https://example.com"');
  });

  it('should allow data:image src', () => {
    const html = '<img src="data:image/png;base64,abc" alt="x" />';
    expect(sanitizeEditorHtml(html)).toContain('data:image/png');
  });

  it('should remove onerror handlers', () => {
    const html = '<img src="https://x.com/a.png" alt="a" onerror="alert(1)" />';
    const result = sanitizeEditorHtml(html);
    expect(result).not.toContain('onerror');
  });

  it('should return empty for whitespace only', () => {
    expect(sanitizeEditorHtml('   ')).toBe('');
  });
});

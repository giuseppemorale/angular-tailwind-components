import { sanitizeEditorHtml } from './editor-html-sanitizer';
import { insertHtml } from './editor-commands';

/** Handle paste: insert sanitized HTML or plain text. */
export function handleEditorPaste(event: ClipboardEvent, root: HTMLElement, sanitize: boolean): void {
  event.preventDefault();
  const data = event.clipboardData;
  if (!data) return;

  const html = data.getData('text/html');
  const plain = data.getData('text/plain');

  if (html && sanitize) {
    const clean = sanitizeEditorHtml(html);
    if (clean) {
      insertHtml(root, clean);
      return;
    }
  }

  if (plain) {
    document.execCommand('insertText', false, plain);
  }
}

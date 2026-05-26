import type { EditorBlockFormat, EditorCommand } from '../models/editor-command.type';

const BLOCK_FORMAT_TAGS = new Set<EditorBlockFormat | 'blockquote'>([
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote'
]);

function execFormatBlock(tag: string): boolean {
  const variants = [`<${tag}>`, tag, tag.toUpperCase()];
  for (const value of variants) {
    if (document.execCommand('formatBlock', false, value)) {
      return true;
    }
  }
  return false;
}

/** Focus the editable root before running a command. */
export function focusEditor(root: HTMLElement): void {
  root.focus();
}

/** Execute a formatting command on the current selection. */
export function executeEditorCommand(root: HTMLElement, command: EditorCommand): boolean {
  focusEditor(root);

  if (BLOCK_FORMAT_TAGS.has(command as EditorBlockFormat | 'blockquote')) {
    const tag = command === 'blockquote' ? 'blockquote' : command;
    return execFormatBlock(tag);
  }

  switch (command) {
    case 'bold':
      return document.execCommand('bold');
    case 'italic':
      return document.execCommand('italic');
    case 'underline':
      return document.execCommand('underline');
    case 'strikethrough':
      return document.execCommand('strikeThrough');
    case 'bulletList':
      return document.execCommand('insertUnorderedList');
    case 'orderedList':
      return document.execCommand('insertOrderedList');
    case 'undo':
      return document.execCommand('undo');
    case 'redo':
      return document.execCommand('redo');
    case 'removeFormat':
      return document.execCommand('removeFormat');
    case 'link':
    case 'imageUrl':
    case 'imageUpload':
      return false;
    default:
      return false;
  }
}

/** Insert a link at the current selection or append at end. */
export function insertLink(root: HTMLElement, url: string, text?: string): void {
  focusEditor(root);
  const label = text?.trim() || url;
  const selection = document.getSelection();
  if (selection && !selection.isCollapsed) {
    document.execCommand('createLink', false, url);
    return;
  }
  const html = `<a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
  document.execCommand('insertHTML', false, html);
}

/** Insert an image at the current selection. */
export function insertImage(root: HTMLElement, src: string, alt = ''): void {
  focusEditor(root);
  const html = `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" />`;
  document.execCommand('insertHTML', false, html);
}

/** Insert sanitized HTML at caret. */
export function insertHtml(root: HTMLElement, html: string): void {
  focusEditor(root);
  document.execCommand('insertHTML', false, html);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/'/g, '&#39;');
}

/** Map toolbar command to queryCommandState key where applicable. */
export function getQueryCommandForActive(command: EditorCommand): string | null {
  switch (command) {
    case 'bold':
      return 'bold';
    case 'italic':
      return 'italic';
    case 'underline':
      return 'underline';
    case 'strikethrough':
      return 'strikeThrough';
    case 'bulletList':
      return 'insertUnorderedList';
    case 'orderedList':
      return 'insertOrderedList';
    default:
      return null;
  }
}

/** Detect active block format from queryCommandValue('formatBlock'). */
export function getActiveBlockCommand(_root: HTMLElement): EditorBlockFormat | 'blockquote' | null {
  if (typeof document.queryCommandValue !== 'function') return null;
  const value = document.queryCommandValue('formatBlock');
  if (!value) return null;
  const tag = value.replace(/[<>]/g, '').toLowerCase();
  if (tag === 'p' || tag === 'div') return 'p';
  if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6') {
    return tag;
  }
  if (tag === 'blockquote') return 'blockquote';
  return null;
}

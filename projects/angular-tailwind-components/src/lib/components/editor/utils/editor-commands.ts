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

const BLOCK_TAGS = new Set(['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'LI', 'PRE']);

const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

type InlineFormat = 'bold' | 'italic' | 'underline' | 'strikethrough';
type TextAlign = 'left' | 'center' | 'right' | 'justify';

const INLINE_FORMAT: Record<InlineFormat, { tag: string; alt: string[] }> = {
  bold: { tag: 'strong', alt: ['b'] },
  italic: { tag: 'em', alt: ['i'] },
  underline: { tag: 'u', alt: [] },
  strikethrough: { tag: 's', alt: ['strike', 'del'] }
};

const INLINE_REMOVE_TAGS = new Set(['strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del', 'span', 'font']);

/** HTML snapshot stack for undo/redo. */
export class EditorHistory {
  private stack: string[] = [];
  private index = -1;

  reset(html: string): void {
    this.stack = [html];
    this.index = 0;
  }

  push(html: string): void {
    if (this.index >= 0 && this.stack[this.index] === html) return;
    const next = this.stack.slice(0, this.index + 1);
    next.push(html);
    if (next.length > 100) next.shift();
    this.stack = next;
    this.index = next.length - 1;
  }

  undo(): string | null {
    if (this.index <= 0) return null;
    this.index -= 1;
    return this.stack[this.index] ?? null;
  }

  redo(): string | null {
    if (this.index >= this.stack.length - 1) return null;
    this.index += 1;
    return this.stack[this.index] ?? null;
  }
}

const savedRanges = new WeakMap<HTMLElement, Range>();

function selectionInsideEditor(root: HTMLElement): boolean {
  const selection = document.getSelection();
  if (!selection?.rangeCount) return false;
  const node = selection.anchorNode;
  if (!node) return false;
  const element = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  return !!element && root.contains(element);
}

/** Remember the current selection while the caret is inside the editor. */
export function saveEditorSelection(root: HTMLElement): void {
  const selection = document.getSelection();
  if (!selection?.rangeCount) return;
  const node = selection.anchorNode;
  if (!node || !root.contains(node)) return;
  savedRanges.set(root, selection.getRangeAt(0).cloneRange());
}

function getSavedRange(root: HTMLElement): Range | null {
  const saved = savedRanges.get(root);
  if (!saved || !root.contains(saved.startContainer)) return null;
  return saved.cloneRange();
}

function applySelection(range: Range): void {
  const selection = document.getSelection();
  if (!selection) return;
  selection.removeAllRanges();
  selection.addRange(range);
}

function resolveRange(root: HTMLElement): Range | null {
  const selection = document.getSelection();
  const live = selection?.rangeCount && selectionInsideEditor(root) ? selection.getRangeAt(0).cloneRange() : null;
  const saved = getSavedRange(root);

  if (live && !live.collapsed) return live;
  if (saved && !saved.collapsed) return saved;
  if (live) return live;
  if (saved) return saved;
  return null;
}

function commitRange(root: HTMLElement, range: Range): void {
  applySelection(range);
  savedRanges.set(root, range.cloneRange());
}

function isBlockElement(el: Element, root: HTMLElement): boolean {
  return el !== root && BLOCK_TAGS.has(el.tagName);
}

function getBlockParent(node: Node, root: HTMLElement): HTMLElement | null {
  let current: Node | null = node.nodeType === Node.ELEMENT_NODE ? node : node.parentNode;
  while (current && current !== root) {
    if (current.nodeType === Node.ELEMENT_NODE && isBlockElement(current as Element, root)) {
      return current as HTMLElement;
    }
    current = current.parentNode;
  }
  return null;
}

function blockChildren(root: HTMLElement): HTMLElement[] {
  return [...root.children].filter(
    (child): child is HTMLElement => child instanceof HTMLElement && isBlockElement(child, root)
  );
}

/** Block under a collapsed caret when the anchor is the editor root (between paragraphs). */
function resolveCollapsedBlock(root: HTMLElement, range: Range): HTMLElement | null {
  const fromNode = getBlockParent(range.startContainer, root);
  if (fromNode) return fromNode;

  if (!range.collapsed || range.startContainer !== root) return null;

  const blocks = blockChildren(root);
  if (!blocks.length) return null;

  const index = range.startOffset;
  if (index > 0) {
    const prev = blocks[index - 1];
    if (prev) return prev;
  }
  return blocks[index] ?? blocks[blocks.length - 1] ?? null;
}

function placeCaretInBlock(range: Range, block: HTMLElement, atEnd: boolean): void {
  if (atEnd) {
    const last = block.lastChild;
    if (last?.nodeType === Node.TEXT_NODE) {
      range.setStart(last, last.textContent?.length ?? 0);
    } else {
      range.selectNodeContents(block);
      range.collapse(false);
    }
  } else {
    const first = block.firstChild;
    if (first?.nodeType === Node.TEXT_NODE) {
      range.setStart(first, 0);
    } else {
      range.selectNodeContents(block);
      range.collapse(true);
    }
  }
  range.collapse(true);
}

/** Move a collapsed caret from the editor root into a real block. */
function normalizeCollapsedRange(root: HTMLElement, range: Range): void {
  if (!range.collapsed) return;

  const block = resolveCollapsedBlock(root, range);
  if (!block) return;

  if (range.startContainer === root) {
    placeCaretInBlock(range, block, range.startOffset > 0);
  }
}

function clearPlaceholderBr(block: HTMLElement): void {
  if (block.childNodes.length === 1 && block.firstChild?.nodeName === 'BR') {
    block.removeChild(block.firstChild);
  }
}

function findAncestorElement(
  node: Node | null,
  root: HTMLElement,
  matcher: (el: Element) => boolean
): HTMLElement | null {
  let current: Node | null = node;
  while (current && current !== root) {
    if (current.nodeType === Node.ELEMENT_NODE && matcher(current as Element)) {
      return current as HTMLElement;
    }
    current = current.parentNode;
  }
  return null;
}

function matchesInlineTag(el: Element, tag: string, alt: string[]): boolean {
  const name = el.tagName.toLowerCase();
  return name === tag || alt.includes(name);
}

function unwrapElement(el: Element): void {
  const parent = el.parentNode;
  if (!parent) {
    el.remove();
    return;
  }
  while (el.firstChild) parent.insertBefore(el.firstChild, el);
  parent.removeChild(el);
}

function ensureBlock(root: HTMLElement, range: Range): HTMLElement {
  if (range.collapsed) {
    normalizeCollapsedRange(root, range);
    const existing = resolveCollapsedBlock(root, range);
    if (existing) return existing;

    const p = document.createElement('p');
    p.appendChild(document.createElement('br'));
    root.appendChild(p);
    range.selectNodeContents(p);
    range.collapse(true);
    return p;
  }

  const block = getBlockParent(range.startContainer, root);
  if (block) return block;

  const p = document.createElement('p');
  p.appendChild(range.extractContents());
  range.insertNode(p);
  return p;
}

function getBlocksForRange(root: HTMLElement, range: Range): HTMLElement[] {
  if (range.collapsed) {
    return [ensureBlock(root, range)];
  }

  const blocks = new Set<HTMLElement>();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (!(node instanceof HTMLElement) || !isBlockElement(node, root)) {
        return NodeFilter.FILTER_SKIP;
      }
      return range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });

  let node: Node | null = walker.nextNode();
  while (node) {
    blocks.add(node as HTMLElement);
    node = walker.nextNode();
  }

  if (!blocks.size) {
    const block = getBlockParent(range.commonAncestorContainer, root);
    if (block) blocks.add(block);
  }

  return [...blocks];
}

function toggleInlineFormat(root: HTMLElement, range: Range, format: InlineFormat): boolean {
  const { tag, alt } = INLINE_FORMAT[format];
  const match = (el: Element) => matchesInlineTag(el, tag, alt);

  if (range.collapsed) {
    normalizeCollapsedRange(root, range);
    const block = resolveCollapsedBlock(root, range);
    if (block) clearPlaceholderBr(block);

    const existing = findAncestorElement(range.startContainer, root, match);
    if (existing) {
      unwrapElement(existing);
      return true;
    }
    const wrapper = document.createElement(tag);
    const marker = document.createTextNode('\u200b');
    wrapper.appendChild(marker);
    range.insertNode(wrapper);
    const caret = document.createRange();
    caret.setStart(marker, 1);
    caret.collapse(true);
    commitRange(root, caret);
    return true;
  }

  const formatter = findAncestorElement(range.commonAncestorContainer, root, match);
  if (formatter && formatter.textContent === range.toString()) {
    unwrapElement(formatter);
    return true;
  }

  const wrapper = document.createElement(tag);
  const contents = range.extractContents();
  if (!contents.textContent?.trim() && contents.childNodes.length === 0) return false;

  wrapper.appendChild(contents);
  range.insertNode(wrapper);

  const after = document.createRange();
  after.selectNodeContents(wrapper);
  after.collapse(false);
  commitRange(root, after);
  return true;
}

function setTextAlign(root: HTMLElement, range: Range, align: TextAlign): boolean {
  const blocks = getBlocksForRange(root, range);
  for (const block of blocks) block.style.textAlign = align;
  return blocks.length > 0;
}

function blockContentRange(block: HTMLElement): Range {
  const blockRange = document.createRange();
  blockRange.selectNodeContents(block);
  return blockRange;
}

function rangeCoversBlockContents(range: Range, block: HTMLElement): boolean {
  const blockRange = blockContentRange(block);
  return (
    range.compareBoundaryPoints(Range.START_TO_START, blockRange) <= 0 &&
    range.compareBoundaryPoints(Range.END_TO_END, blockRange) >= 0
  );
}

function intersectRangeWithBlock(range: Range, block: HTMLElement): Range {
  const blockRange = blockContentRange(block);
  const intersection = document.createRange();

  if (range.compareBoundaryPoints(Range.START_TO_START, blockRange) > 0) {
    intersection.setStart(range.startContainer, range.startOffset);
  } else {
    intersection.setStart(block, 0);
  }

  if (range.compareBoundaryPoints(Range.END_TO_END, blockRange) < 0) {
    intersection.setEnd(range.endContainer, range.endOffset);
  } else {
    intersection.setEnd(block, block.childNodes.length);
  }

  return intersection;
}

function hasMeaningfulContents(fragment: DocumentFragment | null): boolean {
  if (!fragment || !fragment.childNodes.length) return false;
  if (fragment.textContent?.trim()) return true;
  return [...fragment.childNodes].some(
    node => node.nodeType !== Node.TEXT_NODE || (node.textContent?.length ?? 0) > 0
  );
}

function replaceBlockTag(block: HTMLElement, tagName: string): void {
  const next = document.createElement(tagName);
  if (block.style.cssText) next.style.cssText = block.style.cssText;
  next.innerHTML = block.innerHTML;
  block.replaceWith(next);
}

/** Split a block so only the intersecting range gets `tagName`; before/after keep the original tag. */
function splitBlockApplyTag(block: HTMLElement, intersection: Range, tagName: string): void {
  const parent = block.parentNode;
  if (!parent) return;

  const originalTag = block.tagName.toLowerCase();
  const style = block.style.cssText;
  const blockRange = blockContentRange(block);

  const beforeRange = blockRange.cloneRange();
  beforeRange.setEnd(intersection.startContainer, intersection.startOffset);

  const afterRange = blockRange.cloneRange();
  afterRange.setStart(intersection.endContainer, intersection.endOffset);

  const middleRange = intersection.cloneRange();

  const afterContents = !afterRange.collapsed ? afterRange.extractContents() : null;
  const middleContents = middleRange.extractContents();
  const beforeContents = !beforeRange.collapsed ? beforeRange.extractContents() : null;

  const insert: HTMLElement[] = [];

  if (hasMeaningfulContents(beforeContents)) {
    const before = document.createElement(originalTag);
    if (style) before.style.cssText = style;
    before.appendChild(beforeContents!);
    insert.push(before);
  }

  const middle = document.createElement(tagName);
  if (style) middle.style.cssText = style;
  middle.appendChild(middleContents);
  insert.push(middle);

  if (hasMeaningfulContents(afterContents)) {
    const after = document.createElement(originalTag);
    if (style) after.style.cssText = style;
    after.appendChild(afterContents!);
    insert.push(after);
  }

  for (const el of insert) {
    parent.insertBefore(el, block);
  }
  block.remove();
}

function applyBlockTagToBlock(block: HTMLElement, range: Range, tagName: string): void {
  if (block.tagName.toLowerCase() === tagName.toLowerCase()) return;

  if (rangeCoversBlockContents(range, block)) {
    replaceBlockTag(block, tagName);
    return;
  }

  splitBlockApplyTag(block, intersectRangeWithBlock(range, block), tagName);
}

function setBlockTag(root: HTMLElement, range: Range, tagName: string): boolean {
  const blocks = getBlocksForRange(root, range);
  for (const block of blocks) {
    applyBlockTagToBlock(block, range, tagName);
  }
  return blocks.length > 0;
}

function toggleBlockquote(root: HTMLElement, range: Range): boolean {
  const blocks = getBlocksForRange(root, range);
  if (!blocks.length) return false;

  const unwrap = blocks.every(block => block.tagName.toLowerCase() === 'blockquote');
  const targetTag = unwrap ? 'p' : 'blockquote';

  for (const block of blocks) {
    applyBlockTagToBlock(block, range, targetTag);
  }
  return true;
}

function unwrapList(list: HTMLElement): void {
  const items = [...list.querySelectorAll(':scope > li')];
  const parent = list.parentNode;
  if (!parent) return;

  for (const li of items) {
    const p = document.createElement('p');
    p.innerHTML = li.innerHTML;
    parent.insertBefore(p, list);
  }
  list.remove();
}

function toggleList(root: HTMLElement, range: Range, ordered: boolean): boolean {
  const blocks = getBlocksForRange(root, range);
  if (!blocks.length) return false;

  const inList = findAncestorElement(blocks[0], root, el => {
    const t = el.tagName.toLowerCase();
    return t === 'ul' || t === 'ol';
  });

  if (inList) {
    const list = findAncestorElement(blocks[0], root, el => {
      const t = el.tagName.toLowerCase();
      return t === 'ul' || t === 'ol';
    });
    if (list) unwrapList(list);
    return true;
  }

  const list = document.createElement(ordered ? 'ol' : 'ul');
  const first = blocks[0];
  const parent = first.parentNode;
  if (!parent) return false;

  parent.insertBefore(list, first);
  for (const block of blocks) {
    const li = document.createElement('li');
    li.innerHTML = block.innerHTML;
    list.appendChild(li);
    block.remove();
  }
  return true;
}

function removeFormatInRange(root: HTMLElement, range: Range): boolean {
  for (const block of getBlocksForRange(root, range)) {
    block.removeAttribute('style');
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (!(node instanceof HTMLElement)) return NodeFilter.FILTER_SKIP;
      if (!range.intersectsNode(node)) return NodeFilter.FILTER_SKIP;
      const tag = node.tagName.toLowerCase();
      if (INLINE_REMOVE_TAGS.has(tag) || tag === 'a') return NodeFilter.FILTER_ACCEPT;
      return node.getAttribute('style') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });

  const toUnwrap: Element[] = [];
  let node: Node | null = walker.nextNode();
  while (node) {
    toUnwrap.push(node as Element);
    node = walker.nextNode();
  }

  for (const el of toUnwrap) {
    if (el.tagName.toLowerCase() === 'a') {
      el.removeAttribute('style');
      continue;
    }
    if (el.tagName.toLowerCase() === 'span' && el.getAttribute('style')) {
      el.removeAttribute('style');
      if (!el.attributes.length) unwrapElement(el);
      continue;
    }
    unwrapElement(el);
  }

  return true;
}

function insertHtmlAtRange(root: HTMLElement, range: Range, html: string): void {
  range.deleteContents();
  const template = document.createElement('template');
  template.innerHTML = html;
  range.insertNode(template.content);
  range.collapse(false);
  commitRange(root, range);
}

function insertTextAtRange(root: HTMLElement, range: Range, text: string): void {
  range.deleteContents();
  const node = document.createTextNode(text);
  range.insertNode(node);
  range.setStartAfter(node);
  range.collapse(true);
  commitRange(root, range);
}

function wrapRangeInLink(root: HTMLElement, range: Range, url: string): void {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.appendChild(range.extractContents());
  range.insertNode(anchor);
  const after = document.createRange();
  after.selectNodeContents(anchor);
  after.collapse(false);
  commitRange(root, after);
}

function runCommand(root: HTMLElement, command: string, range: Range): boolean {
  switch (command) {
    case 'bold':
      return toggleInlineFormat(root, range, 'bold');
    case 'italic':
      return toggleInlineFormat(root, range, 'italic');
    case 'underline':
      return toggleInlineFormat(root, range, 'underline');
    case 'strikethrough':
      return toggleInlineFormat(root, range, 'strikethrough');
    case 'bulletList':
      return toggleList(root, range, false);
    case 'orderedList':
      return toggleList(root, range, true);
    case 'alignLeft':
      return setTextAlign(root, range, 'left');
    case 'alignCenter':
      return setTextAlign(root, range, 'center');
    case 'alignRight':
      return setTextAlign(root, range, 'right');
    case 'alignJustify':
      return setTextAlign(root, range, 'justify');
    case 'removeFormat':
      return removeFormatInRange(root, range);
    case 'blockquote':
      return toggleBlockquote(root, range);
    case 'p':
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return setBlockTag(root, range, command);
    default:
      return false;
  }
}

function getActiveBlockFormat(root: HTMLElement): EditorBlockFormat | 'blockquote' | null {
  const selection = document.getSelection();
  if (!selection?.anchorNode || !root.contains(selection.anchorNode)) return null;

  const block = getBlockParent(selection.anchorNode, root);
  if (!block) return null;

  const tag = block.tagName.toLowerCase();
  if (tag === 'p' || tag === 'div' || tag === 'li') return 'p';
  if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6') {
    return tag;
  }
  if (tag === 'blockquote') return 'blockquote';
  return null;
}

function isCommandActive(root: HTMLElement, command: EditorCommand): boolean {
  const selection = document.getSelection();
  if (!selection?.anchorNode || !root.contains(selection.anchorNode)) return false;

  switch (command) {
    case 'bold':
    case 'italic':
    case 'underline':
    case 'strikethrough': {
      const { tag, alt } = INLINE_FORMAT[command];
      return !!findAncestorElement(selection.anchorNode, root, el => matchesInlineTag(el, tag, alt));
    }
    case 'bulletList':
      return !!findAncestorElement(selection.anchorNode, root, el => el.tagName === 'UL');
    case 'orderedList':
      return !!findAncestorElement(selection.anchorNode, root, el => el.tagName === 'OL');
    case 'alignLeft': {
      const block = getBlockParent(selection.anchorNode, root);
      return block ? (block.style.textAlign || 'left') === 'left' : true;
    }
    case 'alignCenter': {
      const block = getBlockParent(selection.anchorNode, root);
      return !!block && block.style.textAlign === 'center';
    }
    case 'alignRight': {
      const block = getBlockParent(selection.anchorNode, root);
      return !!block && block.style.textAlign === 'right';
    }
    case 'alignJustify': {
      const block = getBlockParent(selection.anchorNode, root);
      return !!block && block.style.textAlign === 'justify';
    }
    case 'blockquote': {
      const block = getBlockParent(selection.anchorNode, root);
      return block?.tagName.toLowerCase() === 'blockquote';
    }
    default:
      return false;
  }
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/'/g, '&#39;');
}

const ENTER_HANDLED_TAGS = new Set(['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'li']);

function isHeadingBlock(block: HTMLElement): boolean {
  return HEADING_TAGS.has(block.tagName.toLowerCase());
}

function isEnterHandledBlock(block: HTMLElement): boolean {
  return ENTER_HANDLED_TAGS.has(block.tagName.toLowerCase());
}

function tagAfterSplit(block: HTMLElement): string {
  const tag = block.tagName.toLowerCase();
  if (tag === 'li') return 'li';
  if (isHeadingBlock(block) || tag === 'blockquote') return 'p';
  return 'p';
}

function isCaretAtStartOfBlock(block: HTMLElement, range: Range): boolean {
  if (!range.collapsed) return false;
  const start = document.createRange();
  start.selectNodeContents(block);
  start.collapse(true);
  return range.compareBoundaryPoints(Range.START_TO_START, start) === 0;
}

/** True when only whitespace and <br> remain between the caret and the block end. */
function isEffectivelyAtEndOfBlock(block: HTMLElement, range: Range): boolean {
  if (!range.collapsed) return false;

  const tail = document.createRange();
  tail.selectNodeContents(block);
  tail.setStart(range.startContainer, range.startOffset);

  return !hasMeaningfulContent(tail.cloneContents());
}

function hasMeaningfulContent(fragment: DocumentFragment): boolean {
  return walkMeaningfulNodes(fragment);
}

function walkMeaningfulNodes(node: Node | DocumentFragment): boolean {
  for (const child of node.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      if (child.textContent?.trim()) return true;
      continue;
    }
    if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as Element;
      if (el.tagName === 'BR') continue;
      if (walkMeaningfulNodes(el)) return true;
    }
  }
  return false;
}

function trimTrailingBreaks(block: HTMLElement): void {
  while (block.lastChild?.nodeName === 'BR') {
    block.removeChild(block.lastChild);
  }
}

function createEmptyBlock(tagName: string): HTMLElement {
  const block = document.createElement(tagName);
  block.appendChild(document.createElement('br'));
  return block;
}

function placeCaretInNewBlock(root: HTMLElement, block: HTMLElement): void {
  const range = document.createRange();
  range.selectNodeContents(block);
  range.collapse(true);
  commitRange(root, range);
}

function insertBlockAfter(block: HTMLElement, root: HTMLElement): void {
  trimTrailingBreaks(block);
  const next = createEmptyBlock(tagAfterSplit(block));
  block.after(next);
  placeCaretInNewBlock(root, next);
}

function insertBlockBefore(block: HTMLElement, root: HTMLElement): void {
  const prev = createEmptyBlock(tagAfterSplit(block));
  block.before(prev);
  placeCaretInNewBlock(root, prev);
}

function splitBlockAtCaret(block: HTMLElement, root: HTMLElement, range: Range): void {
  const after = document.createRange();
  after.selectNodeContents(block);
  after.setStart(range.startContainer, range.startOffset);

  const next = document.createElement(tagAfterSplit(block));
  const afterContents = after.extractContents();
  if (afterContents.childNodes.length) {
    next.appendChild(afterContents);
  } else {
    next.appendChild(document.createElement('br'));
  }

  trimTrailingBreaks(block);
  block.after(next);
  placeCaretInNewBlock(root, next);
}

/**
 * Enter at the end of a block inserts a new block after it (never <br> inside at EOL).
 * Shift+Enter keeps the browser soft line break.
 */
export function handleEditorEnter(root: HTMLElement): boolean {
  const selection = document.getSelection();
  if (!selection?.rangeCount || !selectionInsideEditor(root)) return false;

  const range = selection.getRangeAt(0);
  if (!range.collapsed) return false;

  const block = getBlockParent(range.startContainer, root);
  if (!block || !isEnterHandledBlock(block)) return false;

  const empty = !block.textContent?.trim();

  if (isEffectivelyAtEndOfBlock(block, range) || empty) {
    insertBlockAfter(block, root);
    return true;
  }

  if (isCaretAtStartOfBlock(block, range)) {
    insertBlockBefore(block, root);
    return true;
  }

  splitBlockAtCaret(block, root, range);
  return true;
}

/** Focus the editable surface (selection is applied separately). */
export function focusEditor(root: HTMLElement): void {
  root.focus({ preventScroll: true });
}

/** Execute a formatting command using the saved or current selection. */
export function executeEditorCommand(root: HTMLElement, command: EditorCommand): boolean {
  const range = resolveRange(root);
  if (!range) {
    focusEditor(root);
    return false;
  }

  applySelection(range);
  focusEditor(root);
  applySelection(range);

  if (range.collapsed) {
    if (!resolveCollapsedBlock(root, range)) {
      ensureBlock(root, range);
    } else {
      normalizeCollapsedRange(root, range);
    }
    applySelection(range);
  }

  const ran = runCommand(root, command, range);
  const after = resolveRange(root);
  if (after) commitRange(root, after);
  return ran;
}

export function insertLink(root: HTMLElement, url: string, text?: string): void {
  const label = text?.trim() || url;
  const html = `<a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
  let range = resolveRange(root);

  if (!range) {
    focusEditor(root);
    root.insertAdjacentHTML('beforeend', html);
    return;
  }

  applySelection(range);
  focusEditor(root);

  if (!range.collapsed) {
    wrapRangeInLink(root, range, url);
    return;
  }

  insertHtmlAtRange(root, range, html);
}

export function insertImage(root: HTMLElement, src: string, alt = ''): void {
  let range = resolveRange(root);
  if (!range) {
    range = document.createRange();
    range.selectNodeContents(root);
    range.collapse(false);
  }
  applySelection(range);
  focusEditor(root);
  insertHtmlAtRange(root, range, `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" />`);
}

export function insertHtml(root: HTMLElement, html: string): void {
  let range = resolveRange(root);
  if (!range) {
    range = document.createRange();
    range.selectNodeContents(root);
    range.collapse(false);
  }
  applySelection(range);
  focusEditor(root);
  insertHtmlAtRange(root, range, html);
}

export function insertText(root: HTMLElement, text: string): void {
  let range = resolveRange(root);
  if (!range) {
    range = document.createRange();
    range.selectNodeContents(root);
    range.collapse(false);
  }
  applySelection(range);
  focusEditor(root);
  insertTextAtRange(root, range, text);
}

export function getActiveBlockCommand(root: HTMLElement): EditorBlockFormat | 'blockquote' | null {
  return getActiveBlockFormat(root);
}

export function getActiveCommands(root: HTMLElement): Set<EditorCommand> {
  const active = new Set<EditorCommand>();
  if (!selectionInsideEditor(root)) return active;

  const toggleCommands: EditorCommand[] = [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'blockquote',
    'bulletList',
    'orderedList',
    'alignLeft',
    'alignCenter',
    'alignRight',
    'alignJustify'
  ];

  for (const cmd of toggleCommands) {
    if (isCommandActive(root, cmd)) active.add(cmd);
  }

  const block = getActiveBlockFormat(root);
  if (block && block !== 'blockquote') active.add(block);

  return active;
}

import type { EditorCommand } from '../models/editor-command.type';
import { getActiveBlockCommand, getQueryCommandForActive } from './editor-commands';

/** Whether the current selection is inside the given editor root. */
export function selectionInsideEditor(root: HTMLElement): boolean {
  const selection = document.getSelection();
  if (!selection?.rangeCount) return false;
  const node = selection.anchorNode;
  if (!node) return false;
  const element = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  return !!element && root.contains(element);
}

/** Compute active toolbar commands for the current selection. */
export function getActiveCommands(root: HTMLElement): Set<EditorCommand> {
  const active = new Set<EditorCommand>();
  if (!selectionInsideEditor(root)) return active;

  const inlineCommands: EditorCommand[] = [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'bulletList',
    'orderedList'
  ];

  if (typeof document.queryCommandState === 'function') {
    for (const cmd of inlineCommands) {
      const query = getQueryCommandForActive(cmd);
      if (query && document.queryCommandState(query)) {
        active.add(cmd);
      }
    }
  }

  const block = getActiveBlockCommand(root);
  if (block) active.add(block);

  return active;
}

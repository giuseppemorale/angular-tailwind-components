import type { EditorCommand, EditorToolbarPreset } from '../models/editor-command.type';
import type { EditorToolbarButtonItem, EditorToolbarGroup } from '../models/editor-toolbar-group.interface';

const FULL_GROUPS: EditorToolbarGroup[] = [
  {
    items: [
      { kind: 'button', command: 'bold', icon: 'bold', ariaLabel: 'Bold' },
      { kind: 'button', command: 'italic', icon: 'italic', ariaLabel: 'Italic' },
      { kind: 'button', command: 'underline', icon: 'underline', ariaLabel: 'Underline' },
      { kind: 'button', command: 'strikethrough', icon: 'strikethrough', ariaLabel: 'Strikethrough' }
    ]
  },
  {
    items: [
      { kind: 'headingSelect', ariaLabel: 'Text style' },
      { kind: 'button', command: 'blockquote', icon: 'chat-bubble-bottom-center-text', ariaLabel: 'Blockquote' }
    ]
  },
  {
    items: [
      { kind: 'button', command: 'bulletList', icon: 'list-bullet', ariaLabel: 'Bullet list' },
      { kind: 'button', command: 'orderedList', icon: 'numbered-list', ariaLabel: 'Numbered list' }
    ]
  },
  {
    items: [
      { kind: 'button', command: 'alignLeft', icon: 'bars-3-center-left', ariaLabel: 'Align left' },
      { kind: 'button', command: 'alignCenter', icon: 'bars-3', ariaLabel: 'Align center' },
      { kind: 'button', command: 'alignRight', icon: 'bars-3-bottom-right', ariaLabel: 'Align right' },
      { kind: 'button', command: 'alignJustify', icon: 'bars-4', ariaLabel: 'Justify' }
    ]
  },
  {
    items: [
      { kind: 'button', command: 'link', icon: 'link', ariaLabel: 'Insert link' },
      { kind: 'button', command: 'imageUrl', icon: 'photo', ariaLabel: 'Insert image from URL' },
      { kind: 'button', command: 'imageUpload', icon: 'arrow-up-tray', ariaLabel: 'Upload image' }
    ]
  },
  {
    items: [
      { kind: 'button', command: 'code', icon: 'code-bracket', ariaLabel: 'Edit HTML' },
      { kind: 'button', command: 'undo', icon: 'arrow-uturn-left', ariaLabel: 'Undo' },
      { kind: 'button', command: 'redo', icon: 'arrow-uturn-right', ariaLabel: 'Redo' },
      { kind: 'button', command: 'removeFormat', icon: 'x-mark', ariaLabel: 'Clear formatting' }
    ]
  }
];

const MINIMAL_COMMANDS: EditorCommand[] = [
  'bold',
  'italic',
  'underline',
  'bulletList',
  'orderedList',
  'link',
  'undo',
  'redo'
];

const BUTTON_BY_COMMAND = new Map<EditorCommand, EditorToolbarButtonItem>();
for (const group of FULL_GROUPS) {
  for (const item of group.items) {
    if (item.kind === 'button') {
      BUTTON_BY_COMMAND.set(item.command, item);
    }
  }
}

export function resolveToolbarGroups(toolbar: EditorToolbarPreset | EditorCommand[]): EditorToolbarGroup[] {
  if (Array.isArray(toolbar)) {
    const items = toolbar
      .map(cmd => BUTTON_BY_COMMAND.get(cmd))
      .filter((item): item is EditorToolbarButtonItem => !!item);
    return items.length ? [{ items }] : [];
  }

  if (toolbar === 'minimal') {
    const items = MINIMAL_COMMANDS.map(cmd => BUTTON_BY_COMMAND.get(cmd)).filter(
      (item): item is EditorToolbarButtonItem => !!item
    );
    return items.length ? [{ items }] : [];
  }

  return FULL_GROUPS;
}

export function filterToolbarGroups(
  groups: EditorToolbarGroup[],
  options: { imageUrlEnabled: boolean; imageUploadEnabled: boolean }
): EditorToolbarGroup[] {
  return groups
    .map(group => ({
      items: group.items.filter(item => {
        if (item.kind !== 'button') return true;
        if (item.command === 'imageUrl' && !options.imageUrlEnabled) return false;
        if (item.command === 'imageUpload' && !options.imageUploadEnabled) return false;
        return true;
      })
    }))
    .filter(group => group.items.length > 0);
}

import type { EditorCommand } from './editor-command.type';
import type { TailwindHeroicon } from '../../../models';

export type { EditorBlockFormat } from './editor-command.type';

export interface EditorToolbarButtonItem {
  kind: 'button';
  command: EditorCommand;
  icon: TailwindHeroicon;
  ariaLabel: string;
}

export interface EditorToolbarHeadingSelectItem {
  kind: 'headingSelect';
  ariaLabel: string;
}

export type EditorToolbarItem = EditorToolbarButtonItem | EditorToolbarHeadingSelectItem;

export interface EditorToolbarGroup {
  items: EditorToolbarItem[];
}

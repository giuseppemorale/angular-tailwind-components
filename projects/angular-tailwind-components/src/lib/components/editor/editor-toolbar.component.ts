import { Component, input, output } from '@angular/core';
import { TailwindOption, TailwindSize } from '../../models';
import { TailwindButton } from '../button/button.component';
import { TailwindDivider } from '../divider/divider.component';
import { TailwindSelect } from '../select/select.component';
import { TailwindComponent } from '../tailwind.component';
import type { EditorBlockFormat, EditorCommand } from './models/editor-command.type';
import type { EditorToolbarButtonItem, EditorToolbarGroup } from './models/editor-toolbar-group.interface';

const HEADING_OPTIONS: TailwindOption<EditorBlockFormat>[] = [
  { value: 'p', label: 'Paragraph' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'h4', label: 'Heading 4' },
  { value: 'h5', label: 'Heading 5' },
  { value: 'h6', label: 'Heading 6' }
];

@Component({
  imports: [TailwindButton, TailwindDivider, TailwindSelect],
  selector: 'tailwind-editor-toolbar',
  templateUrl: './editor-toolbar.component.html',
  styleUrl: './editor-toolbar.component.css'
})
export class TailwindEditorToolbar extends TailwindComponent {
  readonly groups = input<EditorToolbarGroup[]>([]);
  readonly disabled = input<boolean>(false);
  readonly isCodeView = input<boolean>(false);
  readonly codeViewLabel = input<string>('Edit HTML');
  readonly codeViewExitLabel = input<string>('Visual editor');
  readonly textStyleLabel = input<string>('Text style');
  readonly activeCommands = input<Set<EditorCommand>>(new Set());
  readonly blockFormat = input<EditorBlockFormat>('p');
  readonly size = input<TailwindSize>('md');

  readonly commandClick = output<EditorCommand>();

  readonly headingOptions = HEADING_OPTIONS;

  isActive(command: EditorCommand): boolean {
    if (command === 'code') return this.isCodeView();
    return this.activeCommands().has(command);
  }

  isItemDisabled(item: EditorToolbarButtonItem | { kind: 'headingSelect' }): boolean {
    if (this.disabled()) return true;
    if (!this.isCodeView()) return false;
    return item.kind !== 'button' || item.command !== 'code';
  }

  buttonAriaLabel(item: EditorToolbarButtonItem): string {
    if (item.command === 'code') {
      return this.isCodeView() ? this.codeViewExitLabel() : this.codeViewLabel();
    }
    return item.ariaLabel;
  }

  onCommand(command: EditorCommand, event: MouseEvent): void {
    event.preventDefault();
    if (this.disabled()) return;
    if (this.isCodeView() && command !== 'code') return;
    this.commandClick.emit(command);
  }

  onHeadingChange(value: EditorBlockFormat | EditorBlockFormat[] | null): void {
    if (this.isItemDisabled({ kind: 'headingSelect' }) || value == null || Array.isArray(value)) return;
    this.commandClick.emit(value);
  }
}

import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { TailwindSize } from '../../models';
import { TailwindButton } from '../button/button.component';
import { TailwindDivider } from '../divider/divider.component';
import { TailwindSelect } from '../select/select.component';
import { TAILWIND_COMPONENTS_SIZE } from '../../tokens';
import { TailwindComponent } from '../tailwind.component';
import type { EditorBlockFormat, EditorCommand } from './models/editor-command.type';
import type { EditorToolbarButtonItem, EditorToolbarGroup } from './models/editor-toolbar-group.interface';
import { HEADING_OPTIONS } from './properties/constant';

@Component({
  imports: [TailwindButton, TailwindDivider, TailwindSelect],
  selector: 'tailwind-editor-toolbar',
  templateUrl: './editor-toolbar.component.html',
  styleUrl: './editor-toolbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindEditorToolbar extends TailwindComponent {
  private readonly defaultSize = inject(TAILWIND_COMPONENTS_SIZE, { optional: true });

  /** Command groups to render, in order; each group is separated by a divider. */
  readonly groups = input<EditorToolbarGroup[]>([]);
  /** Disables every button, keeping the toolbar visible. */
  readonly disabled = input<boolean>(false);
  /** Toggles the toolbar into HTML source mode. */
  readonly isCodeView = input<boolean>(false);
  /** Label of the button that switches to HTML source mode. */
  readonly codeViewLabel = input<string>('Edit HTML');
  /** Label of the button that returns to the visual editor. */
  readonly codeViewExitLabel = input<string>('Visual editor');
  /** Accessible name of the block-format dropdown. */
  readonly textStyleLabel = input<string>('Text style');
  /** Commands to render as pressed, from the current selection. */
  readonly activeCommands = input<Set<EditorCommand>>(new Set());
  /** Block format of the current selection, shown in the dropdown. */
  readonly blockFormat = input<EditorBlockFormat>('p');
  /** Size of the toolbar controls. */
  readonly size = input<TailwindSize>(this.defaultSize ?? 'md');

  /** Command requested by the user. */
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

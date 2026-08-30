import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef
} from '@angular/core';
import { TailwindSize } from '../../models';
import { TAILWIND_COMPONENTS_SIZE, TAILWIND_LABELS } from '../../tokens';
import { TailwindComponent } from '../tailwind.component';
import { TailwindButton } from '../button/button.component';
import { TailwindIcon } from '../icon/icon.component';
import { TailwindInput } from '../input/input.component';
import type { TailwindOrderListControlsPosition } from './interfaces/order-list-controls-position.type';
import type { TailwindOrderListItemContext } from './interfaces/order-list-item-context.interface';
import { DROP_TARGET, OPTION_BASE, OPTION_SIZE, PANEL_BASE, SHELL_BASE } from './properties/constant';
import { isPinnedBottom, isPinnedTop, moveBottom, moveDown, moveTo, moveTop, moveUp } from './util/order-list-move';

/**
 * Reorderable list: pick one or more rows, then move them with the side buttons, the keyboard,
 * or drag and drop. Follows the ARIA multi-select listbox pattern with `aria-activedescendant`.
 */
@Component({
  imports: [NgTemplateOutlet, TailwindButton, TailwindIcon, TailwindInput],
  selector: 'tailwind-order-list',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindOrderList<T = unknown> extends TailwindComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly defaultSize = inject(TAILWIND_COMPONENTS_SIZE, { optional: true });
  private readonly labels = inject(TAILWIND_LABELS);

  /** Items in their current order; every move writes the reordered array back. */
  readonly items = model<T[]>([]);
  /** Selected items, in the order they appear in the list. */
  readonly selection = model<T[]>([]);

  /** Heading shown above the list. */
  readonly header = input<string>('');
  /** Property of an item object to display; without it the item is rendered with `String()`. */
  readonly optionLabel = input<string>('');
  /** Property that identifies an item, replacing reference equality when items are recreated. */
  readonly dataKey = input<string>('');
  /** Size of the rows and of the reorder buttons. */
  readonly size = input<TailwindSize>(this.defaultSize ?? 'md');
  /** Blocks selection, reordering and dragging. */
  readonly disabled = input<boolean>(false);
  /** Allows reordering by dragging a row onto another. */
  readonly dragdrop = input<boolean>(true);
  /** Shows the filter field above the list. */
  readonly filterable = input<boolean>(false);
  /** Visible label of the filter field; defaults to `TAILWIND_LABELS.search`. */
  readonly filterLabel = input<string>('');
  /** Placeholder of the filter field; defaults to `TAILWIND_LABELS.searchPlaceholder`. */
  readonly filterPlaceholder = input<string>('');
  /** Max height of the scrolling area, as a CSS length. */
  readonly scrollHeight = input<string>('16rem');
  /** Side the reorder buttons sit on. */
  readonly controlsPosition = input<TailwindOrderListControlsPosition>('left');
  /** Accessible name of the listbox; falls back to `header`, then `TAILWIND_LABELS.orderList`. */
  readonly ariaLabel = input<string>('');
  /** Message shown when the list renders no rows; defaults to `TAILWIND_LABELS.noData`. */
  readonly emptyMessage = input<string>('');

  /** New order, emitted after every move. */
  readonly reorder = output<T[]>();

  /** Optional row template, receiving a {@link TailwindOrderListItemContext}. */
  readonly itemTemplate = contentChild('item', { read: TemplateRef });

  /** Row holding `aria-activedescendant`, as an index into {@link displayedItems}. */
  private readonly activeIndex = signal(0);
  /** Fixed end of a Shift range, so repeated Shift+Arrow grows one selection instead of sliding it. */
  private readonly anchorIndex = signal(0);
  private readonly query = signal('');
  private readonly dragIndex = signal<number | null>(null);
  protected readonly dropIndex = signal<number | null>(null);
  /** Live-region text announcing the last move to screen readers. */
  protected readonly announcement = signal('');

  protected readonly filterLabelText = computed(() => this.filterLabel() || this.labels.search);
  protected readonly filterPlaceholderText = computed(() => this.filterPlaceholder() || this.labels.searchPlaceholder);
  protected readonly emptyMessageText = computed(() => this.emptyMessage() || this.labels.noData);
  protected readonly listAriaLabel = computed(() => this.ariaLabel() || this.header() || this.labels.orderList);
  protected readonly reorderLabel = computed(() => this.labels.reorder);
  protected readonly moveUpLabel = computed(() => this.labels.moveUp);
  protected readonly moveTopLabel = computed(() => this.labels.moveTop);
  protected readonly moveDownLabel = computed(() => this.labels.moveDown);
  protected readonly moveBottomLabel = computed(() => this.labels.moveBottom);

  /** Rows actually rendered: the whole list, or what survives the filter. */
  readonly displayedItems = computed<T[]>(() => {
    const query = this.query().trim().toLowerCase();
    if (!query) return this.items();
    return this.items().filter(item => this.labelOf(item).toLowerCase().includes(query));
  });

  /** Positions of the selected items within `items()`, which is what the moves operate on. */
  readonly selectedIndices = computed<number[]>(() => {
    const selection = this.selection();
    return this.items()
      .map((item, index) => (selection.some(picked => this.sameItem(picked, item)) ? index : -1))
      .filter(index => index >= 0);
  });

  protected readonly canMoveUp = computed(
    () =>
      !this.disabled() && this.selectedIndices().length > 0 && !isPinnedTop(this.selectedIndices(), this.items().length)
  );

  protected readonly canMoveDown = computed(
    () =>
      !this.disabled() &&
      this.selectedIndices().length > 0 &&
      !isPinnedBottom(this.selectedIndices(), this.items().length)
  );

  protected readonly shellClasses = computed(() =>
    this.mergeClasses(SHELL_BASE, this.controlsPosition() === 'right' ? 'flex-row-reverse' : '')
  );

  protected readonly panelClasses = PANEL_BASE;

  /** Label used for display, filtering and the reorder announcement. */
  protected labelOf(item: T): string {
    const key = this.optionLabel();
    if (key && item !== null && typeof item === 'object') {
      return String((item as Record<string, unknown>)[key] ?? '');
    }
    return String(item ?? '');
  }

  protected optionId(index: number): string {
    return this.subId('option-' + index);
  }

  protected activeDescendant(): string | null {
    const index = this.activeIndex();
    return index >= 0 && index < this.displayedItems().length ? this.optionId(index) : null;
  }

  protected isActive(index: number): boolean {
    return index === this.activeIndex();
  }

  protected isSelected(item: T): boolean {
    return this.selection().some(picked => this.sameItem(picked, item));
  }

  protected contextFor(item: T, index: number): TailwindOrderListItemContext<T> {
    return { $implicit: item, item, index, selected: this.isSelected(item) };
  }

  protected optionClasses(item: T, index: number): string {
    const selected = this.isSelected(item);
    return [
      OPTION_BASE,
      OPTION_SIZE[this.size()],
      this.disabled() ? 'cursor-not-allowed opacity-60' : this.dragdrop() ? 'cursor-grab' : 'cursor-pointer',
      selected ? 'bg-primary-50 font-medium text-primary-700' : 'text-fg hover:bg-surface-muted',
      this.isActive(index) && !selected ? 'bg-surface-muted' : '',
      this.dropIndex() === index ? DROP_TARGET : ''
    ]
      .filter(Boolean)
      .join(' ');
  }

  protected onFilterChange(query: string): void {
    this.query.set(query);
    this.activeIndex.set(0);
    this.anchorIndex.set(0);
  }

  /** Click selection: plain replaces, Ctrl/Cmd toggles, Shift extends from the active row. */
  protected onOptionClick(index: number, event: MouseEvent): void {
    if (this.disabled()) return;
    const item = this.displayedItems()[index];

    if (event.shiftKey) {
      this.selectRange(this.anchorIndex(), index);
    } else {
      if (event.ctrlKey || event.metaKey) this.toggle(item);
      else this.selection.set([item]);
      this.anchorIndex.set(index);
    }

    this.activeIndex.set(index);
  }

  /** Listbox keyboard behaviour, plus Alt+Arrow as the keyboard equivalent of a drag. */
  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    const rows = this.displayedItems();
    if (rows.length === 0) return;

    const index = Math.min(this.activeIndex(), rows.length - 1);

    if (event.altKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      if (event.key === 'ArrowUp') this.moveSelectionUp();
      else this.moveSelectionDown();
      event.preventDefault();
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        this.moveActive(Math.min(rows.length - 1, index + 1), event);
        break;
      case 'ArrowUp':
        this.moveActive(Math.max(0, index - 1), event);
        break;
      case 'Home':
        this.moveActive(0, event);
        break;
      case 'End':
        this.moveActive(rows.length - 1, event);
        break;
      case ' ':
        this.toggle(rows[index]);
        break;
      case 'Enter':
        this.selection.set([rows[index]]);
        break;
      case 'a':
      case 'A':
        if (!event.ctrlKey && !event.metaKey) return;
        this.selection.set([...rows]);
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  protected moveSelectionUp(): void {
    this.applyMove(moveUp(this.items(), this.selectedIndices()));
  }

  protected moveSelectionTop(): void {
    this.applyMove(moveTop(this.items(), this.selectedIndices()));
  }

  protected moveSelectionDown(): void {
    this.applyMove(moveDown(this.items(), this.selectedIndices()));
  }

  protected moveSelectionBottom(): void {
    this.applyMove(moveBottom(this.items(), this.selectedIndices()));
  }

  protected onDragStart(index: number, event: DragEvent): void {
    if (this.disabled() || !this.dragdrop()) return;
    this.dragIndex.set(index);
    // Firefox drops a drag that carries no payload.
    event.dataTransfer?.setData('text/plain', String(index));
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }

  protected onDragOver(index: number, event: DragEvent): void {
    if (this.dragIndex() === null) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    this.dropIndex.set(index);
  }

  protected onDrop(index: number, event: DragEvent): void {
    const from = this.dragIndex();
    this.onDragEnd();
    if (from === null || from === index) return;
    event.preventDefault();

    const rows = this.displayedItems();
    const items = this.items();
    // A filter shifts the rendered positions, so both ends are mapped back onto `items()`.
    const filtered = rows !== items;
    const fromIndex = filtered ? items.indexOf(rows[from]) : from;
    const toIndex = filtered ? items.indexOf(rows[index]) : index;
    if (fromIndex < 0 || toIndex < 0) return;

    this.selection.set([rows[from]]);
    this.applyMove(moveTo(items, fromIndex, toIndex));
    this.activeIndex.set(index);
    this.anchorIndex.set(index);
  }

  protected onDragEnd(): void {
    this.dragIndex.set(null);
    this.dropIndex.set(null);
  }

  /** Writes the new order and announces where the first selected item landed. */
  private applyMove(next: T[]): void {
    const items = this.items();
    if (next.every((item, i) => item === items[i])) return;

    this.items.set(next);
    this.reorder.emit(next);

    const first = this.selection()[0];
    if (first === undefined) return;
    const position = next.findIndex(item => this.sameItem(item, first));
    this.announcement.set(
      this.labels.itemMoved
        .replace('{item}', this.labelOf(first))
        .replace('{position}', String(position + 1))
        .replace('{total}', String(next.length))
    );
  }

  private moveActive(index: number, event: KeyboardEvent): void {
    if (event.shiftKey) {
      this.selectRange(this.anchorIndex(), index);
    } else {
      if (!event.ctrlKey && !event.metaKey) this.selection.set([this.displayedItems()[index]]);
      this.anchorIndex.set(index);
    }
    this.activeIndex.set(index);
    this.scrollActiveIntoView(index);
  }

  /** `aria-activedescendant` does not scroll the option into view on its own. */
  private scrollActiveIntoView(index: number): void {
    const option = this.host.nativeElement.querySelectorAll<HTMLElement>('[role="option"]').item(index);
    option?.scrollIntoView?.({ block: 'nearest' });
  }

  private selectRange(from: number, to: number): void {
    const rows = this.displayedItems();
    const [start, end] = from <= to ? [from, to] : [to, from];
    this.selection.set(rows.slice(start, end + 1));
  }

  private toggle(item: T): void {
    const selection = this.selection();
    const next = selection.filter(picked => !this.sameItem(picked, item));
    this.selection.set(next.length === selection.length ? [...selection, item] : next);
  }

  /** Identity check: `dataKey` when given, reference equality otherwise. */
  private sameItem(a: T, b: T): boolean {
    const key = this.dataKey();
    if (key && a !== null && b !== null && typeof a === 'object' && typeof b === 'object') {
      return (a as Record<string, unknown>)[key] === (b as Record<string, unknown>)[key];
    }
    return a === b;
  }
}

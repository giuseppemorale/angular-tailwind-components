import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal
} from '@angular/core';
import { TailwindComponent } from '../tailwind.component';
import { TailwindIcon } from '../icon/icon.component';
import type { TailwindTreeNode } from './interfaces/tree-node.interface';
import type { FlatNode } from './interfaces/flat-node.interface';

/**
 * Hierarchical list following the WAI-ARIA tree pattern: one tab stop with a roving `tabindex`,
 * arrows to walk and open branches, Home/End to jump. Only visible rows are rendered.
 */
@Component({
  imports: [TailwindIcon],
  selector: 'tailwind-tree',
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindTree extends TailwindComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Root nodes. */
  readonly nodes = input<TailwindTreeNode[]>([]);
  /** Accessible name for the tree. */
  readonly ariaLabel = input<string>('');

  /** Keys of the expanded branches. */
  readonly expandedKeys = model<Set<string>>(new Set());
  /** Key of the selected node, or `null`. */
  readonly selectedKey = model<string | null>(null);

  readonly nodeSelect = output<TailwindTreeNode>();
  readonly nodeToggle = output<{ node: TailwindTreeNode; expanded: boolean }>();

  /** Row currently holding the widget's single tab stop. */
  private readonly focusedIndex = signal(0);

  /** Only the rows that are actually visible: collapsed branches contribute nothing. */
  readonly visibleNodes = computed<FlatNode[]>(() => {
    const expanded = this.expandedKeys();
    const selected = this.selectedKey();
    const out: FlatNode[] = [];

    const walk = (nodes: TailwindTreeNode[], level: number, parentKey: string): void => {
      for (const node of nodes) {
        const key = parentKey ? `${parentKey}/${node.key}` : node.key;
        const children = node.children ?? [];
        const isExpanded = expanded.has(key);
        out.push({
          node,
          key,
          level,
          expandable: children.length > 0,
          expanded: isExpanded,
          selected: selected === key
        });
        if (isExpanded) walk(children, level + 1, key);
      }
    };

    walk(this.nodes(), 0, '');
    return out;
  });

  rowClasses(flat: FlatNode): string {
    return [
      'flex w-full items-center gap-1.5 rounded-control px-2 py-1.5 text-left text-sm transition-colors duration-150 ease-in-out',
      'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring',
      flat.node.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      flat.selected ? 'bg-primary-50 font-medium text-primary-700' : 'text-neutral-700 hover:bg-neutral-50'
    ]
      .filter(Boolean)
      .join(' ');
  }

  /** Indentation grows with depth; done inline because the depth is unbounded. */
  indentFor(flat: FlatNode): string {
    return `${flat.level * 1.25}rem`;
  }

  select(flat: FlatNode, index: number): void {
    if (flat.node.disabled) return;
    this.focusedIndex.set(index);
    this.selectedKey.set(flat.key);
    this.nodeSelect.emit(flat.node);
  }

  toggle(flat: FlatNode): void {
    if (!flat.expandable || flat.node.disabled) return;
    const next = new Set(this.expandedKeys());
    const willExpand = !next.has(flat.key);
    if (willExpand) next.add(flat.key);
    else next.delete(flat.key);
    this.expandedKeys.set(next);
    this.nodeToggle.emit({ node: flat.node, expanded: willExpand });
  }

  isFocused(index: number): boolean {
    return index === this.focusedIndex();
  }

  /** Tree keyboard behaviour from the WAI-ARIA pattern. */
  onKeydown(event: KeyboardEvent): void {
    const rows = this.visibleNodes();
    if (rows.length === 0) return;

    const index = Math.min(this.focusedIndex(), rows.length - 1);
    const current = rows[index];

    switch (event.key) {
      case 'ArrowDown':
        this.moveFocus(Math.min(rows.length - 1, index + 1));
        break;
      case 'ArrowUp':
        this.moveFocus(Math.max(0, index - 1));
        break;
      case 'Home':
        this.moveFocus(0);
        break;
      case 'End':
        this.moveFocus(rows.length - 1);
        break;
      case 'ArrowRight':
        // Open a closed branch, then step into it.
        if (current.expandable && !current.expanded) this.toggle(current);
        else if (current.expandable) this.moveFocus(Math.min(rows.length - 1, index + 1));
        break;
      case 'ArrowLeft':
        // Close an open branch, otherwise climb to the parent row.
        if (current.expandable && current.expanded) this.toggle(current);
        else this.moveFocus(this.parentIndexOf(rows, index));
        break;
      case 'Enter':
      case ' ':
        this.select(current, index);
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  private parentIndexOf(rows: FlatNode[], index: number): number {
    for (let i = index - 1; i >= 0; i--) {
      if (rows[i].level < rows[index].level) return i;
    }
    return index;
  }

  private moveFocus(index: number): void {
    this.focusedIndex.set(index);
    this.host.nativeElement.querySelectorAll<HTMLElement>('[role="treeitem"]').item(index)?.focus();
  }
}

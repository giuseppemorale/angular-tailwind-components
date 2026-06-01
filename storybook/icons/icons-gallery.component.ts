import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, computed, effect, signal, viewChild } from '@angular/core';
import { TAILWIND_HEROICON_NAMES } from '../../projects/angular-tailwind-components/src/lib/models/icons';
import { TailwindIcon } from '../../projects/angular-tailwind-components/src/public-api';

const GALLERY_COLUMNS = 5;
/** Altezza riga: tile h-28 (7rem) + gap verticale tra righe (1rem). */
const GALLERY_ROW_HEIGHT_PX = 128;

function chunk<T>(items: readonly T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

@Component({
  imports: [TailwindIcon, ScrollingModule],
  selector: 'storybook-icons-gallery',
  template: `
    <div class="mb-6 flex flex-col gap-2 text-neutral-800 dark:text-neutral-100">
      <label class="text-sm font-medium text-neutral-700 dark:text-neutral-300" for="icons-search">
        Cerca icona
      </label>
      <input
        id="icons-search"
        type="search"
        class="w-full max-w-md rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-600 dark:bg-neutral-900"
        placeholder="es. bell, arrow, cog…"
        [value]="query()"
        (input)="onSearchInput($event)" />
      <p class="text-sm text-neutral-500 dark:text-neutral-400">
        {{ filteredIcons().length }} / {{ iconCount }} icone · clicca un’icona per copiare
        <code class="text-neutral-600 dark:text-neutral-300">'nome'</code>
      </p>
    </div>

    @if (filteredIcons().length === 0) {
      <p class="text-sm text-neutral-500 dark:text-neutral-400">
        Nessuna icona corrisponde a «{{ query().trim() }}».
      </p>
    } @else {
      <cdk-virtual-scroll-viewport
        [itemSize]="rowHeightPx"
        class="h-[min(70vh,48rem)] w-full text-neutral-800 dark:text-neutral-100">
        <div
          *cdkVirtualFor="let row of iconRows(); track trackRow($index, row)"
          class="mb-4 grid grid-cols-5 gap-4">
          @for (name of row; track name) {
            <button
              type="button"
              class="flex h-28 flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-neutral-200 bg-white p-3 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-blue-500 dark:hover:bg-blue-950/30"
              [attr.aria-label]="'Copia ' + quotedName(name) + ' negli appunti'"
              (click)="copyIcon(name)">
              <tailwind-icon class="shrink-0" [icon]="name" [size]="24" />
              <code
                class="line-clamp-3 min-h-0 w-full break-all text-center font-mono text-[12px] leading-snug"
                [class.text-blue-600]="copiedName() === name"
                [class.dark:text-blue-400]="copiedName() === name"
                [class.text-neutral-600]="copiedName() !== name"
                [class.dark:text-neutral-400]="copiedName() !== name">
                @if (copiedName() === name) {
                  Copiato!
                } @else {
                  {{ name }}
                }
              </code>
            </button>
          }
        </div>
      </cdk-virtual-scroll-viewport>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorybookIconsGalleryComponent {
  readonly iconCount = TAILWIND_HEROICON_NAMES.length;
  readonly rowHeightPx = GALLERY_ROW_HEIGHT_PX;
  readonly query = signal('');
  readonly copiedName = signal<string | null>(null);

  private readonly viewport = viewChild(CdkVirtualScrollViewport);
  private copyResetTimeout: ReturnType<typeof setTimeout> | undefined;

  readonly filteredIcons = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) {
      return TAILWIND_HEROICON_NAMES;
    }
    return TAILWIND_HEROICON_NAMES.filter(name => name.toLowerCase().includes(q));
  });

  readonly iconRows = computed(() => chunk(this.filteredIcons(), GALLERY_COLUMNS));

  constructor() {
    effect(() => {
      this.filteredIcons();
      queueMicrotask(() => this.viewport()?.checkViewportSize());
    });
  }

  trackRow(index: number, row: readonly string[]): string {
    return `${index}-${row[0] ?? ''}-${row.length}`;
  }

  quotedName(name: string): string {
    return `'${name}'`;
  }

  onSearchInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  copyIcon(name: string): void {
    const text = this.quotedName(name);
    void this.writeClipboard(text).then(ok => {
      if (!ok) {
        return;
      }
      this.copiedName.set(name);
      clearTimeout(this.copyResetTimeout);
      this.copyResetTimeout = setTimeout(() => this.copiedName.set(null), 2000);
    });
  }

  private async writeClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // fallback below
    }
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      textarea.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

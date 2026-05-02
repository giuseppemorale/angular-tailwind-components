import { Component, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'atc-pagination',
  standalone: true,
  template: `
    <nav [attr.aria-label]="ariaLabel()" class="flex items-center gap-1">
      <!-- Previous -->
      <button type="button" [disabled]="currentPage() <= 1" (click)="goToPage(currentPage() - 1)"
        class="p-2 rounded-lg text-surface-500 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
        </svg>
      </button>

      @for (page of visiblePages(); track page) {
        @if (page === -1) {
          <span class="px-2 text-surface-400">…</span>
        } @else {
          <button type="button" (click)="goToPage(page)"
            class="min-w-[2rem] h-8 px-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            [class.bg-primary-600]="page === currentPage()" [class.text-white]="page === currentPage()"
            [class.text-surface-600]="page !== currentPage()" [class.hover:bg-surface-100]="page !== currentPage()">
            {{ page }}
          </button>
        }
      }

      <!-- Next -->
      <button type="button" [disabled]="currentPage() >= totalPages()" (click)="goToPage(currentPage() + 1)"
        class="p-2 rounded-lg text-surface-500 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
        </svg>
      </button>
    </nav>
  `,
  styles: `:host { display: block; }`,
})
export class AtcPagination {
  totalPages = input.required<number>();
  currentPage = model<number>(1);
  maxVisible = input<number>(7);
  ariaLabel = input<string>('Pagination');
  pageChanged = output<number>();

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const max = this.maxVisible();
    if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: number[] = [1];
    const half = Math.floor((max - 4) / 2);
    let start = Math.max(2, current - half);
    let end = Math.min(total - 1, current + half);
    if (current <= half + 2) { end = max - 2; }
    if (current >= total - half - 1) { start = total - max + 3; }
    if (start > 2) pages.push(-1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push(-1);
    pages.push(total);
    return pages;
  });

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.pageChanged.emit(page);
    }
  }
}

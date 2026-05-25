import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  model,
  signal,
  viewChild
} from '@angular/core';
import { TailwindColor } from '../../models';
import { TailwindButton } from '../button/button.component';
import { TailwindTab } from './tab.component';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-tab-group',
  imports: [TailwindButton],
  templateUrl: './tab-group.component.html',
  styleUrl: './tab-group.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindTabGroup extends TailwindComponent {
  private readonly destroyRef = inject(DestroyRef);

  /** Accessible label for the tab list */
  readonly ariaLabel = input<string>('');
  /** Whether tabs can scroll horizontally */
  readonly scrollable = input<boolean>(false);
  /** Accent color for the active tab label and underline indicator */
  readonly color = input<TailwindColor>('primary');

  /** Currently active tab index (two-way) */
  readonly activeIndex = model<number>(0);

  /** Query all child TailwindTab components */
  readonly tabs = contentChildren(TailwindTab);

  readonly tabList = viewChild<ElementRef<HTMLElement>>('tabList');

  readonly canScrollStart = signal(false);
  readonly canScrollEnd = signal(false);

  private resizeObserver?: ResizeObserver;

  constructor() {
    super();
    effect(() => {
      const allTabs = this.tabs();
      const idx = this.activeIndex();
      allTabs.forEach((tab, i) => tab.isActive.set(i === idx));
    });

    effect(() => {
      if (!this.scrollable()) {
        this.canScrollStart.set(false);
        this.canScrollEnd.set(false);
        return;
      }
      this.tabs();
      queueMicrotask(() => this.updateScrollState());
    });

    afterNextRender(() => {
      const el = this.tabList()?.nativeElement;
      if (!el) {
        return;
      }

      const onScroll = () => this.updateScrollState();
      el.addEventListener('scroll', onScroll, { passive: true });

      this.resizeObserver = new ResizeObserver(() => this.updateScrollState());
      this.resizeObserver.observe(el);

      this.updateScrollState();

      this.destroyRef.onDestroy(() => {
        el.removeEventListener('scroll', onScroll);
        this.resizeObserver?.disconnect();
      });
    });
  }

  selectTab(index: number): void {
    this.activeIndex.set(index);
  }

  onTabListScroll(): void {
    this.updateScrollState();
  }

  scrollTabs(direction: -1 | 1): void {
    const el = this.tabList()?.nativeElement;
    if (!el) {
      return;
    }
    const step = Math.max(120, el.clientWidth * 0.75);
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  }

  /** Maps vertical wheel / trackpad to horizontal scroll when the tab strip overflows. */
  onTabListWheel(event: WheelEvent): void {
    if (!this.scrollable()) {
      return;
    }
    const nav = event.currentTarget as HTMLElement;
    if (nav.scrollWidth <= nav.clientWidth) {
      return;
    }

    const delta =
      Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (delta === 0) {
      return;
    }

    const previous = nav.scrollLeft;
    nav.scrollLeft += delta;
    if (nav.scrollLeft !== previous) {
      event.preventDefault();
    }
  }

  private updateScrollState(): void {
    const el = this.tabList()?.nativeElement;
    if (!el || !this.scrollable()) {
      this.canScrollStart.set(false);
      this.canScrollEnd.set(false);
      return;
    }

    const epsilon = 1;
    this.canScrollStart.set(el.scrollLeft > epsilon);
    this.canScrollEnd.set(el.scrollLeft + el.clientWidth < el.scrollWidth - epsilon);
  }

  private readonly activeTextClass = computed(() => {
    const map: Record<TailwindColor, string> = {
      primary: 'text-primary-600',
      secondary: 'text-neutral-800',
      success: 'text-success-600',
      warning: 'text-warning-600',
      danger: 'text-danger-600',
      info: 'text-info-600',
      transparent: 'text-neutral-700'
    };
    return map[this.color()];
  });

  private readonly indicatorClass = computed(() => {
    const map: Record<TailwindColor, string> = {
      primary: 'bg-primary-600',
      secondary: 'bg-neutral-600',
      success: 'bg-success-600',
      warning: 'bg-warning-500',
      danger: 'bg-danger-600',
      info: 'bg-info-600',
      transparent: 'bg-neutral-400'
    };
    return map[this.color()];
  });

  private readonly focusRingClass = computed(() => {
    const map: Record<TailwindColor, string> = {
      primary: 'focus-visible:ring-primary-500/30',
      secondary: 'focus-visible:ring-neutral-400/40',
      success: 'focus-visible:ring-success-500/30',
      warning: 'focus-visible:ring-warning-500/30',
      danger: 'focus-visible:ring-danger-500/30',
      info: 'focus-visible:ring-info-500/30',
      transparent: 'focus-visible:ring-neutral-400/30'
    };
    return map[this.color()];
  });

  tabButtonClass(index: number, disabled: boolean): string {
    const active = this.activeIndex() === index;
    return [
      'group relative shrink-0 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-150',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:rounded-t-lg',
      this.focusRingClass(),
      active ? this.activeTextClass() : 'text-neutral-500',
      !active && !disabled ? 'hover:text-neutral-700' : '',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    ]
      .filter(Boolean)
      .join(' ');
  }

  tabIndicatorClass(index: number): string {
    const active = this.activeIndex() === index;
    return [
      'absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-200',
      active ? this.indicatorClass() : '',
      active ? 'scale-x-100' : 'scale-x-0'
    ]
      .filter(Boolean)
      .join(' ');
  }
}

import { Component, computed, input, signal } from '@angular/core';
import { TailwindColor, TailwindSize } from '../../models';
import { TailwindIcon } from '../icon/icon.component';
import { TailwindComponent } from '../tailwind.component';

@Component({
  imports: [TailwindIcon],
  selector: 'tailwind-avatar',
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css'
})
export class TailwindAvatar extends TailwindComponent {
  /** Image URL */
  readonly src = input<string>('');
  /** Image alt text */
  readonly alt = input<string>('');
  /** Full name used to derive initials when `initials` is empty */
  readonly name = input<string>('');
  /** Explicit initials override */
  readonly initials = input<string>('');
  /** Size variant */
  readonly size = input<TailwindSize>('md');
  /** Avatar shape */
  readonly shape = input<'circle' | 'rounded'>('circle');
  /** Background color for initials fallback */
  readonly color = input<TailwindColor>('secondary');
  /** Optional status dot color (omit to hide the indicator) */
  readonly status = input<TailwindColor>();

  private readonly failedSrc = signal<string | null>(null);

  readonly showImage = computed(() => {
    const src = this.src()?.trim();
    return !!src && this.failedSrc() !== src;
  });

  readonly computedInitials = computed(() => {
    const explicit = this.initials().trim();
    if (explicit) return explicit.slice(0, 3).toUpperCase();

    const name = this.name().trim();
    if (!name) return '';

    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
    }
    return parts[0]!.slice(0, 2).toUpperCase();
  });

  readonly accessibleLabel = computed(() => {
    const label = this.alt().trim() || this.name().trim();
    return label || 'Avatar';
  });

  readonly hostClasses = computed(() => {
    const sizeMap: Record<TailwindSize, string> = {
      xs: 'size-6',
      sm: 'size-8',
      md: 'size-10',
      lg: 'size-12',
      xl: 'size-14'
    };

    return this.mergeClasses('relative inline-flex shrink-0 select-none', sizeMap[this.size()]);
  });

  readonly innerClasses = computed(() => {
    const textMap: Record<TailwindSize, string> = {
      xs: 'text-[10px]',
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg'
    };

    const shape = this.shape() === 'circle' ? 'rounded-full' : 'rounded-md';

    return [
      'flex h-full w-full items-center justify-center overflow-hidden font-semibold',
      textMap[this.size()],
      shape
    ].join(' ');
  });

  readonly initialsClasses = computed(() => {
    const colorMap: Record<TailwindColor, string> = {
      primary: 'bg-primary-100 text-primary-700',
      secondary: 'bg-neutral-200 text-neutral-700',
      success: 'bg-success-100 text-success-800',
      warning: 'bg-warning-100 text-warning-900',
      danger: 'bg-danger-100 text-danger-800',
      info: 'bg-info-100 text-info-800',
      transparent: 'bg-neutral-100 text-neutral-600 border border-neutral-200'
    };

    return ['flex h-full w-full items-center justify-center', colorMap[this.color()]].join(' ');
  });

  readonly imageClasses = computed(() => {
    return this.shape() === 'circle'
      ? 'h-full w-full object-cover rounded-full'
      : 'h-full w-full object-cover rounded-md';
  });

  readonly iconSize = computed(() => {
    const map: Record<TailwindSize, number> = {
      xs: 14,
      sm: 16,
      md: 20,
      lg: 24,
      xl: 28
    };
    return map[this.size()];
  });

  readonly statusDotClasses = computed(() => {
    const status = this.status();
    if (!status) return '';

    const colorMap: Record<TailwindColor, string> = {
      primary: 'bg-primary-600',
      secondary: 'bg-neutral-500',
      success: 'bg-success-600',
      warning: 'bg-warning-500',
      danger: 'bg-danger-600',
      info: 'bg-info-600',
      transparent: 'bg-neutral-300'
    };

    return ['avatar-status', `avatar-status--${this.size()}`, colorMap[status]].join(' ');
  });

  readonly fallbackClasses = computed(() => {
    const colorMap: Record<TailwindColor, string> = {
      primary: 'bg-primary-100 text-primary-600',
      secondary: 'bg-neutral-200 text-neutral-500',
      success: 'bg-success-100 text-success-700',
      warning: 'bg-warning-100 text-warning-700',
      danger: 'bg-danger-100 text-danger-700',
      info: 'bg-info-100 text-info-700',
      transparent: 'bg-neutral-100 text-neutral-500 border border-neutral-200'
    };

    return ['flex h-full w-full items-center justify-center', colorMap[this.color()]].join(' ');
  });

  onImageError(): void {
    this.failedSrc.set(this.src()?.trim() ?? null);
  }
}

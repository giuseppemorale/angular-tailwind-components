import { Component, computed, contentChildren, effect, input, model } from '@angular/core';
import { TailwindColor } from '../../models';
import { TailwindStep } from './step.component';
import { TailwindIcon } from '../icon/icon.component';
import { TailwindComponent } from '../tailwind.component';

@Component({
  imports: [TailwindIcon],
  selector: 'tailwind-stepper',
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css'
})
export class TailwindStepper extends TailwindComponent {
  readonly activeIndex = model<number>(0);
  readonly linear = input<boolean>(false);
  /** Accent color for active and completed steps */
  readonly color = input<TailwindColor>('primary');

  readonly steps = contentChildren(TailwindStep);

  private readonly stepCircleActiveClass = computed(() => {
    const map: Record<TailwindColor, string> = {
      primary: 'bg-primary-600 border-primary-600 text-on-primary-600',
      secondary: 'bg-neutral-600 border-neutral-600 text-white',
      success: 'bg-success-600 border-success-600 text-on-success-600',
      warning: 'bg-warning-500 border-warning-500 text-on-warning-500',
      danger: 'bg-danger-600 border-danger-600 text-on-danger-600',
      info: 'bg-info-600 border-info-600 text-on-info-600',
      transparent: 'bg-white border-neutral-700 text-neutral-800'
    };
    return map[this.color()];
  });

  private readonly stepLabelActiveClass = computed(() => {
    const map: Record<TailwindColor, string> = {
      primary: 'text-primary-700',
      secondary: 'text-neutral-800',
      success: 'text-success-700',
      warning: 'text-warning-700',
      danger: 'text-danger-700',
      info: 'text-info-700',
      transparent: 'text-neutral-800'
    };
    return map[this.color()];
  });

  private readonly connectorActiveClass = computed(() => {
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

  constructor() {
    super();
    effect(() => {
      const allSteps = this.steps();
      const idx = this.activeIndex();
      allSteps.forEach((s, i) => s.isActive.set(i === idx));
    });
  }

  goToStep(index: number): void {
    if (!this.linear() || index <= this.activeIndex()) {
      this.activeIndex.set(index);
    }
  }

  next(): void {
    const s = this.steps();
    if (this.activeIndex() < s.length - 1) {
      s[this.activeIndex()].completed.set(true);
      this.activeIndex.update(v => v + 1);
    }
  }

  previous(): void {
    if (this.activeIndex() > 0) this.activeIndex.update(v => v - 1);
  }

  stepCircleClass(index: number): string {
    const active = index <= this.activeIndex();
    const base =
      'w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-200';
    return active ? `${base} ${this.stepCircleActiveClass()}` : `${base} border-neutral-300 text-neutral-600`;
  }

  stepLabelClass(index: number): string {
    const active = index <= this.activeIndex();
    return ['text-sm font-medium text-left', active ? this.stepLabelActiveClass() : 'text-neutral-700'].join(' ');
  }

  connectorClass(index: number): string {
    const completed = index < this.activeIndex();
    return [
      'flex-1 h-0.5 mx-3 mt-4 shrink-0 rounded-full transition-colors duration-200',
      completed ? this.connectorActiveClass() : 'bg-neutral-200'
    ].join(' ');
  }
}

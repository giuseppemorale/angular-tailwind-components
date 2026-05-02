import { Component, contentChildren, input, model, effect } from '@angular/core';
import { TailwindStep } from './step.component';

@Component({
  selector: 'tailwind-stepper',
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss'
})
export class TailwindStepper {
  readonly activeIndex = model<number>(0);
  readonly linear = input<boolean>(false);
  steps = contentChildren(TailwindStep);

  constructor() {
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
}

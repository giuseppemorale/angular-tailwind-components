import { Component, contentChildren, input, model, effect } from '@angular/core';
import { TailwindStep } from './step.component';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-stepper',
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css'
})
export class TailwindStepper extends TailwindComponent {
  readonly activeIndex = model<number>(0);
  readonly linear = input<boolean>(false);

  readonly steps = contentChildren(TailwindStep);

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
}

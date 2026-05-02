import { Component, contentChildren, input, model, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'atc-step',
  standalone: true,
  template: `
    @if (isActive()) {
      <div class="py-4"><ng-content /></div>
    }
  `,
  styles: `:host { display: block; }`,
})
export class AtcStep {
  label = input.required<string>();
  description = input<string>('');
  optional = input<boolean>(false);
  completed = signal(false);
  isActive = signal(false);
}

@Component({
  selector: 'atc-stepper',
  standalone: true,
  template: `
    <!-- Step indicators -->
    <div class="flex items-center mb-6">
      @for (step of steps(); track step.label(); let i = $index; let last = $last) {
        <div class="flex items-center" [class.flex-1]="!last">
          <button type="button" (click)="goToStep(i)"
            class="flex items-center gap-2 cursor-pointer group"
            [attr.aria-current]="activeIndex() === i ? 'step' : null">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-200"
              [class.bg-primary-600]="i <= activeIndex()" [class.border-primary-600]="i <= activeIndex()" [class.text-white]="i <= activeIndex()"
              [class.border-surface-300]="i > activeIndex()" [class.text-surface-500]="i > activeIndex()">
              @if (step.completed()) {
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                </svg>
              } @else {
                {{ i + 1 }}
              }
            </div>
            <div class="hidden sm:block">
              <p class="text-sm font-medium" [class.text-primary-600]="i <= activeIndex()" [class.text-surface-500]="i > activeIndex()">{{ step.label() }}</p>
              @if (step.description()) { <p class="text-xs text-surface-400">{{ step.description() }}</p> }
            </div>
          </button>
          @if (!last) {
            <div class="flex-1 h-0.5 mx-3 rounded-full transition-colors duration-200"
              [class.bg-primary-600]="i < activeIndex()" [class.bg-surface-200]="i >= activeIndex()"></div>
          }
        </div>
      }
    </div>
    <!-- Step content -->
    <ng-content />
  `,
  styles: `:host { display: block; }`,
})
export class AtcStepper {
  activeIndex = model<number>(0);
  linear = input<boolean>(false);
  steps = contentChildren(AtcStep);

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

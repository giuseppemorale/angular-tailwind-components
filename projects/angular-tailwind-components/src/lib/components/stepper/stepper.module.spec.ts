import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TailwindStepperModule } from './stepper.module';

// Il modulo è l'unico import dell'host: se un declarable della famiglia non è esportato, il template non si applica.
@Component({
  imports: [TailwindStepperModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-stepper>
      <tailwind-step label="One">Step one</tailwind-step>
      <tailwind-step label="Two">Step two</tailwind-step>
    </tailwind-stepper>
  `
})
class StepperModuleHostComponent {}

describe('TailwindStepperModule', () => {
  it('should expose stepper and steps to a host importing only the module', async () => {
    await TestBed.configureTestingModule({ imports: [StepperModuleHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(StepperModuleHostComponent);
    fixture.detectChanges();

    const indicators: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    expect(indicators.length).toBe(2);
    expect(indicators[0].getAttribute('aria-current')).toBe('step');
    expect(fixture.nativeElement.textContent).toContain('Step one');
  });
});

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TailwindTooltipModule } from './tooltip.module';

// Il modulo è l'unico import dell'host: senza la direttiva esportata il focus non aprirebbe alcun overlay.
@Component({
  imports: [TailwindTooltipModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<button type="button" tailwindTooltip="Tooltip text">Hover me</button>`
})
class TooltipModuleHostComponent {}

describe('TailwindTooltipModule', () => {
  it('should expose the tooltip directive to a host importing only the module', async () => {
    await TestBed.configureTestingModule({ imports: [TooltipModuleHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(TooltipModuleHostComponent);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).focus();
    await new Promise(resolve => setTimeout(resolve, 250));
    fixture.detectChanges();

    expect(document.body.querySelector('[role="tooltip"]')?.textContent).toContain('Tooltip text');
  });
});

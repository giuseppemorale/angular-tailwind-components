import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TailwindTabGroupModule } from './tab-group.module';

// Il modulo è l'unico import dell'host: se un declarable della famiglia non è esportato, il template non si applica.
@Component({
  imports: [TailwindTabGroupModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-tab-group>
      <tailwind-tab label="One">Panel one</tailwind-tab>
      <tailwind-tab label="Two">Panel two</tailwind-tab>
    </tailwind-tab-group>
  `
})
class TabGroupModuleHostComponent {}

describe('TailwindTabGroupModule', () => {
  it('should expose tab group and tabs to a host importing only the module', async () => {
    await TestBed.configureTestingModule({ imports: [TabGroupModuleHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(TabGroupModuleHostComponent);
    fixture.detectChanges();

    const tabs: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]'));
    expect(fixture.nativeElement.querySelector('[role="tablist"]')).toBeTruthy();
    expect(tabs.length).toBe(2);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
  });
});

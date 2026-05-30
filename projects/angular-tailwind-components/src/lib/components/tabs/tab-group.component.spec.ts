import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindTabGroup } from './tab-group.component';
import { TailwindTab } from './tab.component';

@Component({
  imports: [TailwindTabGroup, TailwindTab],
  template: `
    <tailwind-tab-group [stretch]="stretch" [scrollable]="scrollable" [(activeIndex)]="activeIndex">
      <tailwind-tab label="Tab A">Content A</tailwind-tab>
      <tailwind-tab label="Tab B">Content B</tailwind-tab>
      <tailwind-tab label="Tab C">Content C</tailwind-tab>
    </tailwind-tab-group>
  `
})
class TabGroupHostComponent {
  stretch = false;
  scrollable = false;
  activeIndex = 0;
}

describe('TailwindTabGroup', () => {
  let fixture: ComponentFixture<TabGroupHostComponent>;
  let host: TabGroupHostComponent;

  function tabButtons(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]'));
  }

  beforeEach(async () => {
    vi.stubGlobal(
      'ResizeObserver',
      vi.fn(() => ({
        observe: vi.fn(),
        disconnect: vi.fn(),
        unobserve: vi.fn()
      }))
    );

    await TestBed.configureTestingModule({
      imports: [TabGroupHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TabGroupHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.nativeElement.querySelector('tailwind-tab-group')).toBeTruthy();
  });

  it('should use shrink-0 on tab buttons by default', () => {
    const buttons = tabButtons();
    expect(buttons.length).toBe(3);
    for (const button of buttons) {
      expect(button.className).toContain('shrink-0');
      expect(button.className).not.toContain('flex-1');
    }
  });

  it('should stretch tab buttons when stretch is true', () => {
    fixture = TestBed.createComponent(TabGroupHostComponent);
    host = fixture.componentInstance;
    host.stretch = true;
    fixture.detectChanges();

    const buttons = tabButtons();
    for (const button of buttons) {
      expect(button.className).toContain('flex-1');
      expect(button.className).toContain('text-center');
      expect(button.className).not.toContain('shrink-0');
    }

    const nav = fixture.nativeElement.querySelector('.tailwind-tab-list');
    expect(nav?.className).toContain('w-full');
  });

  it('should keep shrink-0 when stretch and scrollable are both true', () => {
    fixture = TestBed.createComponent(TabGroupHostComponent);
    host = fixture.componentInstance;
    host.stretch = true;
    host.scrollable = true;
    fixture.detectChanges();

    const buttons = tabButtons();
    for (const button of buttons) {
      expect(button.className).toContain('shrink-0');
      expect(button.className).not.toContain('flex-1');
    }

    const nav = fixture.nativeElement.querySelector('.tailwind-tab-list');
    expect(nav?.className).not.toContain('w-full');
  });

  it('should select tab on click', () => {
    tabButtons()[1]?.click();
    fixture.detectChanges();

    expect(host.activeIndex).toBe(1);
    expect(tabButtons()[1]?.getAttribute('aria-selected')).toBe('true');
  });
});

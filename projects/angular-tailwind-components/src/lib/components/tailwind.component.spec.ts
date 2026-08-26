import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TailwindComponent } from './tailwind.component';

/**
 * Exercises the base class every component extends, through a minimal component that surfaces the
 * protected helpers.
 */
@Component({
  selector: 'tailwind-base-probe',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="surfaceClasses()" [attr.id]="innerId()"></div>`
})
class ProbeComponent extends TailwindComponent {
  surfaceClasses(): string {
    return this.mergeClasses('base-a', 'base-b');
  }

  innerId(): string {
    return this.subId('inner');
  }
}

describe('TailwindComponent', () => {
  function create() {
    const fixture = TestBed.createComponent(ProbeComponent);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ProbeComponent] }).compileComponents();
  });

  it('should merge consumer classes after the structural ones', () => {
    const fixture = create();
    fixture.componentRef.setInput('class', 'text-danger-600');
    fixture.detectChanges();

    const surface: HTMLElement = fixture.nativeElement.querySelector('div');
    // Order matters: the consumer's classes come last so they can override.
    expect(surface.className).toBe('base-a base-b text-danger-600');
  });

  it('should drop empty class fragments rather than emit double spaces', () => {
    const fixture = create();
    expect(fixture.nativeElement.querySelector('div').className).toBe('base-a base-b');
  });

  it('should generate a usable identity when the consumer omits id', () => {
    const fixture = create();
    const id = fixture.componentInstance.elementId();

    expect(id).toBeTruthy();
    expect(fixture.nativeElement.querySelector('div').id).toBe(`${id}-inner`);
  });

  it('should give each instance its own generated identity', () => {
    const first = create();
    const second = create();
    expect(first.componentInstance.elementId()).not.toBe(second.componentInstance.elementId());
  });

  it('should prefer the consumer id over the generated one', () => {
    const fixture = create();
    fixture.componentRef.setInput('id', 'my-field');
    fixture.detectChanges();

    expect(fixture.componentInstance.elementId()).toBe('my-field');
    expect(fixture.nativeElement.querySelector('div').id).toBe('my-field-inner');
  });

  it('should only put an id on the host when the consumer provided one', () => {
    const fixture = create();
    expect(fixture.nativeElement.getAttribute('id')).toBeNull();

    fixture.componentRef.setInput('id', 'my-field');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('id')).toBe('my-field');
  });
});

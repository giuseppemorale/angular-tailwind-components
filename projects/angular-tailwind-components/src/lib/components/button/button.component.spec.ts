import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TAILWIND_BUTTON_KIND } from '../../tokens';
import { TailwindButton } from './button.component';

@Component({
  imports: [TailwindButton],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<tailwind-button icon="plus">Add</tailwind-button>`
})
class ButtonWithLabelHost {}

describe('TailwindButton', () => {
  let fixture: ComponentFixture<TailwindButton>;
  let component: TailwindButton;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindButton]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should let the native click bubble to the host', () => {
    const spy = vi.fn();
    // There is no `onClick` output any more: consumers bind plain `(click)`.
    fixture.nativeElement.addEventListener('click', spy);

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not fire a click event when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const spy = vi.fn();
    // The native button's own click bubbles to the host; a disabled button emits nothing.
    fixture.nativeElement.addEventListener('click', spy);

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should set aria-label on the native button when ariaLabel is provided', () => {
    fixture.componentRef.setInput('icon', 'plus');
    fixture.componentRef.setInput('ariaLabel', 'Add item');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Add item');
  });

  it('should set aria-pressed on the native button, not the host', () => {
    fixture.componentRef.setInput('ariaPressed', true);
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button')!;
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(host.getAttribute('aria-pressed')).toBeNull();
  });

  it('should not write a redundant role on the native button', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    // `<button>` already exposes role "button"; repeating it in an attribute adds nothing.
    expect(button.getAttribute('role')).toBeNull();
  });

  it('should apply custom role when set', () => {
    fixture.componentRef.setInput('role', 'menuitem');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('role')).toBe('menuitem');
  });

  it('should have disabled attribute when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(true);
  });

  it('should apply color and kind classes', () => {
    fixture.componentRef.setInput('color', 'danger');
    fixture.componentRef.setInput('kind', 'solid');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.className).toContain('bg-danger-600');
    expect(button.className).toContain('text-on-danger-600');
  });

  it('should use TAILWIND_BUTTON_KIND as default kind when input is omitted', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TailwindButton],
      providers: [{ provide: TAILWIND_BUTTON_KIND, useValue: 'flat' }]
    }).compileComponents();

    const tokenFixture = TestBed.createComponent(TailwindButton);
    tokenFixture.detectChanges();

    const button: HTMLButtonElement = tokenFixture.nativeElement.querySelector('button');
    expect(button.className).toContain('border-transparent');
    expect(button.className).not.toContain('surface-highlight');
  });

  it('should apply flat kind without the top highlight, border tint or hover state', () => {
    fixture.componentRef.setInput('kind', 'flat');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.className).toContain('border-transparent');
    expect(button.className).not.toContain('surface-highlight');
    expect(button.className).not.toContain('shadow-sm');
    expect(button.className).not.toContain('hover:bg-');
    expect(button.className).not.toContain('active:bg-');
  });

  it('should tint the surface for the soft kind without filling it', () => {
    fixture.componentRef.setInput('kind', 'soft');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.className).toContain('bg-primary-50');
    expect(button.className).toContain('text-primary-700');
    expect(button.className).not.toContain('bg-primary-600');
  });

  it('should give solid buttons a top highlight instead of a drop shadow', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.className).toContain('surface-highlight');
    expect(button.className).not.toContain('shadow-sm');
  });

  it('should keep transparent color without hover or active background tint', () => {
    fixture.componentRef.setInput('color', 'transparent');
    fixture.componentRef.setInput('kind', 'ghost');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.className).toContain('bg-transparent');
    expect(button.className).toContain('hover:bg-transparent');
    expect(button.className).toContain('active:bg-transparent');
    expect(button.className).not.toContain('hover:bg-neutral');
    expect(button.className).not.toContain('hover:bg-primary');
  });

  it('should render icon when icon input is set', () => {
    fixture.componentRef.setInput('icon', 'plus');
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('tailwind-icon');
    expect(icon).toBeTruthy();
  });

  it('should place icon before label when iconPosition is left', () => {
    fixture.componentRef.setInput('icon', 'plus');
    fixture.componentRef.setInput('iconPosition', 'left');
    fixture.detectChanges();

    const content: HTMLElement = fixture.nativeElement.querySelector('button > span');
    const children = Array.from(content.children) as Element[];
    expect(children[0]?.tagName.toLowerCase()).toBe('tailwind-icon');
  });

  it('should place icon after label when iconPosition is right', () => {
    fixture.componentRef.setInput('icon', 'plus');
    fixture.componentRef.setInput('iconPosition', 'right');
    fixture.detectChanges();

    const content: HTMLElement = fixture.nativeElement.querySelector('button > span');
    const children = Array.from(content.children) as Element[];
    expect(children.at(-1)?.tagName.toLowerCase()).toBe('tailwind-icon');
  });

  it('should apply icon-only padding classes when icon is set without label', () => {
    fixture.componentRef.setInput('icon', 'plus');
    fixture.componentRef.setInput('size', 'md');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    // Square footprint: the height already comes from the size scale, only the width is overridden.
    expect(button.className).toContain('has-[.tailwind-button-label:empty]:w-9');
    expect(button.className).toContain('has-[.tailwind-button-label:empty]:px-0');
    expect(button.className).toContain('h-9');
  });

  it('should use text padding when icon and label are present', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ButtonWithLabelHost]
    }).compileComponents();

    const hostFixture = TestBed.createComponent(ButtonWithLabelHost);
    hostFixture.detectChanges();

    const button: HTMLButtonElement = hostFixture.nativeElement.querySelector('button');

    expect(button.className).toContain('px-4');
    // The height is pinned rather than derived from vertical padding, so a button and an input of
    // the same size line up on the same row.
    expect(button.className).toContain('h-9');
    expect(button.className).not.toContain('py-2');
  });
  it('should show a spinner and block activation while loading', () => {
    let clicks = 0;
    fixture.nativeElement.addEventListener('click', () => clicks++);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(fixture.nativeElement.querySelector('.animate-spin')).toBeTruthy();

    button.click();
    expect(clicks).toBe(0);
  });

  it('should not report aria-busy when not loading', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-busy')).toBeNull();
  });

  it('should stretch to full width when fullWidth is set', () => {
    fixture.componentRef.setInput('fullWidth', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button').className).toContain('w-full');
  });
});

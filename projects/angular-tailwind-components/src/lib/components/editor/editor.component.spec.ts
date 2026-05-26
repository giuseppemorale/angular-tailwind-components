import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { TAILWIND_EDITOR_LABELS } from '../../tokens';
import { TailwindEditor } from './editor.component';

describe('TailwindEditor', () => {
  let fixture: ComponentFixture<TailwindEditor>;
  let component: TailwindEditor;

  beforeEach(async () => {
    Object.defineProperty(document, 'execCommand', {
      value: vi.fn().mockReturnValue(true),
      configurable: true,
      writable: true
    });

    await TestBed.configureTestingModule({
      imports: [TailwindEditor]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply writeValue without emitting htmlChange', () => {
    const spy = vi.fn();
    component.htmlChange.subscribe(spy);
    component.writeValue('<p>Hello</p>');
    fixture.detectChanges();
    expect(component.value()).toBe('<p>Hello</p>');
    expect(spy).not.toHaveBeenCalled();
  });

  it('should apply writeValue in code view without requiring editable element', () => {
    component.onToolbarCommand('code');
    fixture.detectChanges();
    component.writeValue('<p>Code mode</p>');
    fixture.detectChanges();
    expect(component.value()).toBe('<p>Code mode</p>');
    expect(component.sourceHtml()).toBe('<p>Code mode</p>');
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.isDisabled()).toBe(true);
  });

  it('should disable contenteditable when readonly', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();
    const surface = fixture.nativeElement.querySelector('.tailwind-editor-surface');
    expect(surface.getAttribute('contenteditable')).toBe('false');
  });

  it('should disable toolbar buttons when readonly', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('tailwind-editor-toolbar tailwind-button button');
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((btn: HTMLButtonElement) => {
      expect(btn.disabled).toBe(true);
    });
  });

  it('should emit htmlChange on user input', () => {
    const spy = vi.fn();
    component.htmlChange.subscribe(spy);
    const surface = fixture.nativeElement.querySelector('.tailwind-editor-surface') as HTMLElement;
    surface.innerHTML = '<p>Test</p>';
    surface.dispatchEvent(new InputEvent('input', { bubbles: true }));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should toggle code view and show HTML textarea', () => {
    const surface = fixture.nativeElement.querySelector('.tailwind-editor-surface') as HTMLElement;
    surface.innerHTML = '<p>Hi</p>';
    fixture.detectChanges();

    component.onToolbarCommand('code');
    fixture.detectChanges();

    expect(component.isCodeView()).toBe(true);
    expect(fixture.nativeElement.querySelector('.tailwind-editor-source')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.tailwind-editor-surface')).toBeFalsy();
  });

  it('should use labels from TAILWIND_EDITOR_LABELS token', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TailwindEditor],
      providers: [
        {
          provide: TAILWIND_EDITOR_LABELS,
          useValue: { linkModalTitle: 'Custom link title' }
        }
      ]
    }).compileComponents();

    const customFixture = TestBed.createComponent(TailwindEditor);
    customFixture.detectChanges();
    expect(customFixture.componentInstance.labels().linkModalTitle).toBe('Custom link title');
  });
});

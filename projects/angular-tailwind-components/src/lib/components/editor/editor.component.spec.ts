import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { TAILWIND_EDITOR_LABELS } from '../../tokens';
import { TailwindEditor } from './editor.component';

describe('TailwindEditor', () => {
  let fixture: ComponentFixture<TailwindEditor>;
  let component: TailwindEditor;

  beforeEach(async () => {
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

  it('should insert two spaces when Tab is pressed in code view', () => {
    component.onToolbarCommand('code');
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector('.tailwind-editor-source') as HTMLTextAreaElement;
    textarea.value = '<p></p>';
    textarea.selectionStart = textarea.selectionEnd = 3;
    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(textarea.value).toBe('<p>  </p>');
    expect(textarea.selectionStart).toBe(5);
  });

  it('should show line numbers in code view', () => {
    component.onToolbarCommand('code');
    fixture.detectChanges();

    const numbers = fixture.nativeElement.querySelectorAll('.tailwind-editor-line-number');
    expect(numbers.length).toBeGreaterThan(0);
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

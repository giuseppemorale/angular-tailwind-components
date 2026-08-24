import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindOption } from '../../models';
import { TailwindSelect } from './select.component';

interface Country {
  id: number;
  name: string;
}

const OPTIONS: TailwindOption<string>[] = [
  { value: 'it', label: 'Italy' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany', disabled: true },
  { value: 'es', label: 'Spain' }
];

describe('TailwindSelect', () => {
  let fixture: ComponentFixture<TailwindSelect<string>>;
  let component: TailwindSelect<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindSelect]
    }).compileComponents();

    fixture = TestBed.createComponent<TailwindSelect<string>>(TailwindSelect);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', OPTIONS);
    fixture.detectChanges();
  });

  // Destroying disposes the CDK overlay, so a panel left open cannot leak into the next test.
  afterEach(() => fixture.destroy());

  function trigger(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('[role="combobox"]');
  }

  function options(): HTMLElement[] {
    return Array.from(document.querySelectorAll('.cdk-overlay-container [role="option"]'));
  }

  function open(): void {
    trigger().click();
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose a combobox that is collapsed by default', () => {
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(trigger().getAttribute('aria-haspopup')).toBe('listbox');
  });

  it('should point aria-controls at the listbox it opens', () => {
    open();

    const listbox: HTMLElement | null = document.querySelector('.cdk-overlay-container [role="listbox"]');
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(listbox?.id).toBeTruthy();
    expect(trigger().getAttribute('aria-controls')).toBe(listbox?.id);
  });

  it('should report the highlighted option through aria-activedescendant', () => {
    open();
    expect(trigger().getAttribute('aria-activedescendant')).toBeNull();

    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    const active = trigger().getAttribute('aria-activedescendant');
    expect(active).toBeTruthy();
    expect(options().some(o => o.id === active)).toBe(true);
  });

  it('should mark every option with aria-selected', () => {
    open();
    expect(options().every(o => o.hasAttribute('aria-selected'))).toBe(true);
  });

  it('should select an option on click and close the panel', () => {
    open();
    options()[0].click();
    fixture.detectChanges();

    expect(component.value()).toBe('it');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
  });

  it('should skip disabled options with the arrow keys', () => {
    open();
    const keydown = (key: string) => {
      trigger().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      fixture.detectChanges();
    };

    keydown('ArrowDown'); // Italy
    keydown('ArrowDown'); // France
    keydown('ArrowDown'); // skips disabled Germany → Spain
    expect(component.activeIndex()).toBe(3);
  });

  it('should jump to the first and last enabled option with Home and End', () => {
    open();
    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    expect(component.activeIndex()).toBe(3);

    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();
    expect(component.activeIndex()).toBe(0);
  });

  it('should not open when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    trigger().click();
    fixture.detectChanges();

    expect(component.isOpen()).toBe(false);
  });

  it('should implement CVA writeValue and setDisabledState', () => {
    component.writeValue('fr');
    expect(component.value()).toBe('fr');

    component.setDisabledState(true);
    expect(component.isDisabled()).toBe(true);
  });

  it('should mark the field invalid only when hasError is set', () => {
    expect(trigger().getAttribute('aria-invalid')).toBeNull();

    fixture.componentRef.setInput('hasError', true);
    fixture.detectChanges();
    expect(trigger().getAttribute('aria-invalid')).toBe('true');
  });

  it('should associate label, control and helper text without a consumer id', () => {
    fixture.componentRef.setInput('label', 'Country');
    fixture.componentRef.setInput('helperText', 'Pick one');
    fixture.detectChanges();

    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
    const helper: HTMLElement = fixture.nativeElement.querySelector('p');

    expect(label.getAttribute('for')).toBe(trigger().id);
    expect(trigger().getAttribute('aria-describedby')).toBe(helper.id);
  });

  it('should match object values through compareWith', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({ imports: [TailwindSelect] }).compileComponents();

    const objFixture = TestBed.createComponent<TailwindSelect<Country>>(TailwindSelect);
    const objOptions: TailwindOption<Country>[] = [
      { value: { id: 1, name: 'Italy' }, label: 'Italy' },
      { value: { id: 2, name: 'France' }, label: 'France' }
    ];
    objFixture.componentRef.setInput('options', objOptions);
    objFixture.componentRef.setInput('compareWith', (a: Country | null, b: Country | null) => a?.id === b?.id);
    objFixture.detectChanges();

    // A structurally equal object from a different fetch must still resolve to the option.
    objFixture.componentInstance.writeValue({ id: 2, name: 'France' });
    objFixture.detectChanges();

    expect(objFixture.componentInstance.selectedOption()?.label).toBe('France');
    objFixture.destroy();
  });

  it('should not match a structurally equal object without compareWith', () => {
    const objFixture = TestBed.createComponent<TailwindSelect<Country>>(TailwindSelect);
    objFixture.componentRef.setInput('options', [{ value: { id: 1, name: 'Italy' }, label: 'Italy' }]);
    objFixture.detectChanges();

    objFixture.componentInstance.writeValue({ id: 1, name: 'Italy' });
    objFixture.detectChanges();

    expect(objFixture.componentInstance.selectedOption()).toBeNull();
    objFixture.destroy();
  });

  it('should collect several values in multiple mode', () => {
    fixture.componentRef.setInput('multiple', true);
    fixture.detectChanges();

    // In multiple mode the panel stays open between selections.
    open();
    options()[0].click();
    fixture.detectChanges();
    options()[1].click();
    fixture.detectChanges();

    expect(component.value()).toEqual(['it', 'fr']);
  });
});

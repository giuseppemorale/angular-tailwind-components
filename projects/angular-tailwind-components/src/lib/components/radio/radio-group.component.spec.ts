import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindOptionGroup } from '../../models';
import { TailwindRadioGroup } from './radio-group.component';

const OPTIONS: TailwindOptionGroup<string>[] = [
  { value: 'card', label: 'Card', description: 'Visa, Mastercard' },
  { value: 'bank', label: 'Bank transfer' },
  { value: 'cash', label: 'Cash', disabled: true }
];

describe('TailwindRadioGroup', () => {
  let fixture: ComponentFixture<TailwindRadioGroup<string>>;
  let component: TailwindRadioGroup<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindRadioGroup]
    }).compileComponents();

    fixture = TestBed.createComponent<TailwindRadioGroup<string>>(TailwindRadioGroup);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', OPTIONS);
    fixture.detectChanges();
  });

  function radios(): HTMLInputElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('input[type="radio"]'));
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the radio group pattern', () => {
    const group: HTMLElement = fixture.nativeElement.querySelector('[role="radiogroup"]');
    expect(group.tagName.toLowerCase()).toBe('fieldset');
    expect(radios().length).toBe(3);
  });

  it('should render the visible label as a legend', () => {
    fixture.componentRef.setInput('label', 'Payment');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('legend')?.textContent).toContain('Payment');
  });

  it('should render option descriptions', () => {
    expect(fixture.nativeElement.textContent).toContain('Visa, Mastercard');
  });

  it('should select an option on change', () => {
    radios()[1].click();
    fixture.detectChanges();

    expect(component.value()).toBe('bank');
    expect(radios()[1].checked).toBe(true);
  });

  it('should disable a single option without disabling the group', () => {
    expect(radios()[2].disabled).toBe(true);
    expect(radios()[0].disabled).toBe(false);
  });

  it('should lay out horizontally on request', () => {
    const group: HTMLElement = fixture.nativeElement.querySelector('[role="radiogroup"]');
    expect(group.className).toContain('flex-col');

    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="radiogroup"]').className).not.toContain('flex-col');
  });

  it('should implement CVA writeValue and setDisabledState', () => {
    component.writeValue('card');
    fixture.detectChanges();
    expect(component.value()).toBe('card');

    component.setDisabledState(true);
    fixture.detectChanges();
    expect(radios().every(r => r.disabled)).toBe(true);
  });

  it('should notify the form when an option is chosen', () => {
    const spy = vi.fn();
    component.registerOnChange(spy);

    radios()[0].click();
    expect(spy).toHaveBeenCalledWith('card');
  });
});

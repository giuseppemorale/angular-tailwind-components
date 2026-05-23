import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TailwindOption } from '../../models';
import { TailwindAutocomplete } from './autocomplete.component';

const COUNTRIES = [
  { value: 'IT', label: 'Italia' },
  { value: 'FR', label: 'Francia' },
  { value: 'DE', label: 'Germania' },
  { value: 'ES', label: 'Spagna' }
];

describe('TailwindAutocomplete', () => {
  let fixture: ComponentFixture<TailwindAutocomplete<string>>;
  let component: TailwindAutocomplete<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindAutocomplete]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindAutocomplete<string>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', COUNTRIES);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label when provided', () => {
    fixture.componentRef.setInput('label', 'Paese');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('label')?.textContent).toContain('Paese');
  });

  it('should show error text when hasError', () => {
    fixture.componentRef.setInput('hasError', true);
    fixture.componentRef.setInput('errorText', 'Campo obbligatorio');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.text-danger-600')?.textContent).toContain('Campo obbligatorio');
  });

  it('should update searchQuery on input without setting CVA value', () => {
    const onChange = vi.fn();
    component.registerOnChange(onChange);

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'ita';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.searchQuery()).toBe('ita');
    expect(component.value()).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should emit onSearch when typing', () => {
    const searchSpy = vi.fn();
    component.onSearch.subscribe(searchSpy);

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'fra';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(searchSpy).toHaveBeenCalledWith('fra');
  });

  it('should filter options locally when filterLocally is true', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'ita';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.filteredOptions().map(o => o.value)).toEqual(['IT']);
  });

  it('should set value and call onChange only when selecting an option', () => {
    const onChange = vi.fn();
    component.registerOnChange(onChange);

    component.selectOption(COUNTRIES[0]);
    fixture.detectChanges();

    expect(component.value()).toBe('IT');
    expect(component.searchQuery()).toBe('Italia');
    expect(onChange).toHaveBeenCalledWith('IT');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should clear value when typing diverges from selected option label', () => {
    component.writeValue('IT');
    fixture.detectChanges();

    const onChange = vi.fn();
    component.registerOnChange(onChange);

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'It';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value()).toBeNull();
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('should implement CVA writeValue', () => {
    component.writeValue('FR');
    expect(component.value()).toBe('FR');
    expect(component.searchQuery()).toBe('Francia');
  });

  it('should implement CVA setDisabledState', () => {
    component.setDisabledState(true);
    expect(component.isDisabled()).toBe(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input')?.disabled).toBe(true);
  });

  it('should restore selected label on blur when forceSelection is true', async () => {
    component.writeValue('IT');
    fixture.detectChanges();

    component.searchQuery.set('xyz');
    component.onBlur();
    await Promise.resolve();
    fixture.detectChanges();

    expect(component.searchQuery()).toBe('Italia');
  });

  it('should have combobox role on input', () => {
    expect(fixture.nativeElement.querySelector('input[role="combobox"]')).toBeTruthy();
  });
});

@Component({
  imports: [TailwindAutocomplete],
  template: `
    <tailwind-autocomplete [options]="options">
      <ng-template let-option #item>
        <span class="custom-option">{{ option.label }} ({{ option.value }})</span>
      </ng-template>
    </tailwind-autocomplete>
  `
})
class AutocompleteWithItemTemplateComponent {
  readonly options = COUNTRIES;
}

@Component({
  imports: [TailwindAutocomplete],
  template: `
    <tailwind-autocomplete
      [options]="filteredOptions()"
      [filterLocally]="false"
      [debounceMs]="200"
      (onSearch)="handleSearch($event)" />
  `
})
class AsyncHostComponent {
  readonly filteredOptions = signal<TailwindOption<string>[]>([]);

  handleSearch(query: string): void {
    this.filteredOptions.set(COUNTRIES.filter(c => c.label.toLowerCase().startsWith(query.toLowerCase())));
  }
}

describe('TailwindAutocomplete async mode', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncHostComponent]
    }).compileComponents();
  });

  it('should update options after debounced onSearch', async () => {
    const hostFixture = TestBed.createComponent(AsyncHostComponent);
    hostFixture.detectChanges();

    const acDe = hostFixture.debugElement.query(By.directive(TailwindAutocomplete));
    const ac = acDe.componentInstance as TailwindAutocomplete<string>;
    const input: HTMLInputElement = acDe.nativeElement.querySelector('input');

    input.value = 'ita';
    input.dispatchEvent(new Event('input'));
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.filteredOptions()).toEqual([]);

    await new Promise(r => setTimeout(r, 250));
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.filteredOptions().map(o => o.value)).toEqual(['IT']);
    expect(ac.filteredOptions().map(o => o.value)).toEqual(['IT']);
    expect(ac.searchQuery()).toBe('ita');
  });
});

describe('TailwindAutocomplete with #item template', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteWithItemTemplateComponent]
    }).compileComponents();
  });

  it('should expose projected #item template', () => {
    const fixture = TestBed.createComponent(AutocompleteWithItemTemplateComponent);
    fixture.detectChanges();
    const ac = fixture.debugElement.query(By.directive(TailwindAutocomplete))
      .componentInstance as TailwindAutocomplete<string>;
    expect(ac.itemTemplate()).toBeTruthy();
  });
});

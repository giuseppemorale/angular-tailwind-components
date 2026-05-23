import { ChangeDetectionStrategy, Component, Input, model, signal } from '@angular/core';
import { argsToTemplate, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import {
  TailwindAutocomplete,
  TailwindOption,
  TailwindSize
} from '../../../projects/angular-tailwind-components/src/public-api';

const COUNTRIES: TailwindOption<string>[] = [
  { value: 'IT', label: 'Italia' },
  { value: 'FR', label: 'Francia' },
  { value: 'DE', label: 'Germania' },
  { value: 'ES', label: 'Spagna' },
  { value: 'GB', label: 'Regno Unito' },
  { value: 'US', label: 'Stati Uniti' },
  { value: 'JP', label: 'Giappone' },
  { value: 'BR', label: 'Brasile' }
];

const meta: Meta<TailwindAutocomplete<string>> = {
  title: 'Forms/Autocomplete',
  component: TailwindAutocomplete,
  parameters: { docs: { story: { height: '320px' } } }
};
export default meta;

export const StaticCountries: StoryObj<TailwindAutocomplete<string>> = {
  name: 'Nazioni (filtro locale)',
  render: args => ({
    props: { ...args, countryCode: null as string | null },
    template: `
    <div class="max-w-lg">
      <tailwind-autocomplete ${argsToTemplate(args)} [(value)]="countryCode" />
      <p class="mt-2 text-sm text-neutral-600">Valore form: {{ countryCode ?? 'null' }}</p>
    </div>
    `
  }),
  args: {
    label: 'Paese',
    placeholder: 'Cerca paese...',
    options: COUNTRIES,
    filterLocally: true
  }
};

@Component({
  selector: 'autocomplete-async-story',
  imports: [TailwindAutocomplete],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-lg">
      <tailwind-autocomplete
        [label]="label"
        [placeholder]="placeholder"
        [options]="filteredOptions()"
        [filterLocally]="false"
        [debounceMs]="debounceMs"
        [size]="size"
        [(value)]="countryCode"
        (onSearch)="handleSearch($event)" />
      <p class="mt-2 text-sm text-neutral-600">Valore form: {{ countryCode() ?? 'null' }}</p>
    </div>
  `
})
class AutocompleteAsyncStoryComponent {
  @Input() label = 'Paese';
  @Input() placeholder = 'Digita per cercare...';
  @Input() debounceMs = 200;
  size: TailwindSize = 'md';
  readonly countryCode = model<string | null>(null);
  readonly filteredOptions = signal<TailwindOption<string>[]>([]);

  handleSearch(query: string): void {
    const q = query.toLowerCase();
    this.filteredOptions.set(COUNTRIES.filter(c => c.label.toLowerCase().startsWith(q)));
  }
}

export const AsyncSearch: StoryObj<TailwindAutocomplete<string>> = {
  name: 'Ricerca async',
  decorators: [
    moduleMetadata({
      imports: [AutocompleteAsyncStoryComponent]
    })
  ],
  render: args => ({
    props: args,
    template: `
      <autocomplete-async-story
        [label]="label"
        [placeholder]="placeholder"
        [debounceMs]="debounceMs" />
    `
  }),
  args: {
    label: 'Paese',
    placeholder: 'Digita per cercare...',
    debounceMs: 200
  }
};

export const CustomItemTemplate: StoryObj<TailwindAutocomplete<string>> = {
  name: 'Template opzione (#item)',
  render: args => ({
    props: { ...args, countryCode: null as string | null },
    template: `
    <div class="max-w-lg">
      <tailwind-autocomplete ${argsToTemplate(args)} [(value)]="countryCode">
        <ng-template let-option #item>
          <span class="flex items-center gap-2 w-full">
            <span class="font-mono text-xs text-neutral-500">{{ option.value }}</span>
            <span>{{ option.label }}</span>
          </span>
        </ng-template>
      </tailwind-autocomplete>
      <p class="mt-2 text-sm text-neutral-600">Valore form: {{ countryCode ?? 'null' }}</p>
    </div>
    `
  }),
  args: {
    label: 'Paese',
    placeholder: 'Cerca paese...',
    options: COUNTRIES
  }
};

export const WithError: StoryObj<TailwindAutocomplete<string>> = {
  name: 'Stato errore',
  render: args => ({
    props: args,
    template: `
    <div class="max-w-lg">
      <tailwind-autocomplete ${argsToTemplate(args)} />
    </div>
    `
  }),
  args: {
    label: 'Paese',
    placeholder: 'Cerca paese...',
    options: COUNTRIES,
    hasError: true,
    errorText: 'Seleziona un paese valido.'
  }
};

import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { TailwindInput } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindInput> = {
  title: 'Forms/Input',
  component: TailwindInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    type: { control: 'select', options: ['text', 'password', 'email', 'number', 'search'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
    hasError: { control: 'boolean' },
    required: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<TailwindInput>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<tailwind-input [label]="label" [placeholder]="placeholder" [type]="type" [size]="size" [helperText]="helperText" [hasError]="hasError" [errorText]="errorText" [required]="required" />`,
  }),
  args: { label: 'Email', placeholder: 'Enter your email', type: 'email', size: 'md', helperText: 'We will never share your email.', hasError: false, errorText: '', required: false },
};

export const WithError: Story = {
  render: () => ({
    template: `<tailwind-input label="Username" placeholder="Enter username" [hasError]="true" errorText="Username is already taken" />`,
  }),
};

export const WithPrefixAndSuffix: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-4 max-w-sm">
        <tailwind-input label="Search" placeholder="Search anything...">
          <tailwind-prefix>
            <svg class="w-4 h-4 text-surface-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
            </svg>
          </tailwind-prefix>
        </tailwind-input>
        <tailwind-input label="Price" placeholder="0.00">
          <tailwind-prefix>â‚¬</tailwind-prefix>
          <tailwind-suffix>.00</tailwind-suffix>
        </tailwind-input>
        <tailwind-input label="Website" placeholder="yoursite.com">
          <tailwind-prefix>https://</tailwind-prefix>
        </tailwind-input>
      </div>`,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-4 max-w-sm">
        <tailwind-input label="Extra Small" size="xs" placeholder="xs" />
        <tailwind-input label="Small" size="sm" placeholder="sm" />
        <tailwind-input label="Medium" size="md" placeholder="md" />
        <tailwind-input label="Large" size="lg" placeholder="lg" />
        <tailwind-input label="Extra Large" size="xl" placeholder="xl" />
      </div>
    `,
  }),
};


export const Interactive: Story = {
  render: (args) => ({
    props: args,
    template: `<tailwind-input [label]="label" [placeholder]="placeholder" [type]="type" [size]="size" [helperText]="helperText" [hasError]="hasError" [errorText]="errorText" [required]="required"  ${argsToTemplate(args)}/>`,
  }),
  args: {
    label: '',
    placeholder: '',
    type: 'text',
    size: 'md',
    required: false,
    readonly: false,
    helperText: '',
    errorText: '',
    hasError: false,
    prefixIcon: false,
    suffixIcon: false
  }
};

import type { Meta, StoryObj } from '@storybook/angular';
import { AtcInput } from 'angular-tailwind-components';

const meta: Meta<AtcInput> = {
  title: 'Components/Input',
  component: AtcInput,
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
type Story = StoryObj<AtcInput>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<atc-input [label]="label" [placeholder]="placeholder" [type]="type" [size]="size" [helperText]="helperText" [hasError]="hasError" [errorText]="errorText" [required]="required" />`,
  }),
  args: { label: 'Email', placeholder: 'Enter your email', type: 'email', size: 'md', helperText: 'We will never share your email.', hasError: false, errorText: '', required: false },
};

export const WithError: Story = {
  render: () => ({
    template: `<atc-input label="Username" placeholder="Enter username" [hasError]="true" errorText="Username is already taken" />`,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-4 max-w-sm">
        <atc-input label="Extra Small" size="xs" placeholder="xs" />
        <atc-input label="Small" size="sm" placeholder="sm" />
        <atc-input label="Medium" size="md" placeholder="md" />
        <atc-input label="Large" size="lg" placeholder="lg" />
        <atc-input label="Extra Large" size="xl" placeholder="xl" />
      </div>
    `,
  }),
};

import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindButton } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindButton> = {
  title: 'Components/Button',
  component: TailwindButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success', 'warning', 'info'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
  },
};
export default meta;
type Story = StoryObj<TailwindButton>;

export const Primary: Story = {
  render: (args) => ({
    props: args,
    template: `<tailwind-button [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading" [fullWidth]="fullWidth">Button</tailwind-button>`,
  }),
  args: { variant: 'primary', size: 'md', disabled: false, loading: false, fullWidth: false },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-3 items-center">
        <tailwind-button variant="primary">Primary</tailwind-button>
        <tailwind-button variant="secondary">Secondary</tailwind-button>
        <tailwind-button variant="outline">Outline</tailwind-button>
        <tailwind-button variant="ghost">Ghost</tailwind-button>
        <tailwind-button variant="danger">Danger</tailwind-button>
        <tailwind-button variant="success">Success</tailwind-button>
        <tailwind-button variant="warning">Warning</tailwind-button>
        <tailwind-button variant="info">Info</tailwind-button>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-3 items-center">
        <tailwind-button size="xs">Extra Small</tailwind-button>
        <tailwind-button size="sm">Small</tailwind-button>
        <tailwind-button size="md">Medium</tailwind-button>
        <tailwind-button size="lg">Large</tailwind-button>
        <tailwind-button size="xl">Extra Large</tailwind-button>
      </div>
    `,
  }),
};

export const Loading: Story = {
  render: () => ({
    template: `<tailwind-button [loading]="true">Loading...</tailwind-button>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<tailwind-button [disabled]="true">Disabled</tailwind-button>`,
  }),
};

export const FullWidth: Story = {
  render: () => ({
    template: `<tailwind-button [fullWidth]="true">Full Width Button</tailwind-button>`,
  }),
};

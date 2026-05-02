import type { Meta, StoryObj } from '@storybook/angular';
import { AtcButton } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcButton> = {
  title: 'Components/Button',
  component: AtcButton,
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
type Story = StoryObj<AtcButton>;

export const Primary: Story = {
  render: (args) => ({
    props: args,
    template: `<atc-button [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading" [fullWidth]="fullWidth">Button</atc-button>`,
  }),
  args: { variant: 'primary', size: 'md', disabled: false, loading: false, fullWidth: false },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-3 items-center">
        <atc-button variant="primary">Primary</atc-button>
        <atc-button variant="secondary">Secondary</atc-button>
        <atc-button variant="outline">Outline</atc-button>
        <atc-button variant="ghost">Ghost</atc-button>
        <atc-button variant="danger">Danger</atc-button>
        <atc-button variant="success">Success</atc-button>
        <atc-button variant="warning">Warning</atc-button>
        <atc-button variant="info">Info</atc-button>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-3 items-center">
        <atc-button size="xs">Extra Small</atc-button>
        <atc-button size="sm">Small</atc-button>
        <atc-button size="md">Medium</atc-button>
        <atc-button size="lg">Large</atc-button>
        <atc-button size="xl">Extra Large</atc-button>
      </div>
    `,
  }),
};

export const Loading: Story = {
  render: () => ({
    template: `<atc-button [loading]="true">Loading...</atc-button>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<atc-button [disabled]="true">Disabled</atc-button>`,
  }),
};

export const FullWidth: Story = {
  render: () => ({
    template: `<atc-button [fullWidth]="true">Full Width Button</atc-button>`,
  }),
};

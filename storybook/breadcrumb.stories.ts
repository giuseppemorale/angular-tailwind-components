import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindBreadcrumb } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindBreadcrumb> = {
  title: 'Components/Breadcrumb',
  component: TailwindBreadcrumb,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<TailwindBreadcrumb>;

export const Default: Story = {
  render: () => ({
    template: `
      <tailwind-breadcrumb [items]="items"></tailwind-breadcrumb>`,
    props: {
      items: [
        { label: 'Home', href: '#' },
        { label: 'Products', href: '#' },
        { label: 'Angular Components', href: '#' },
        { label: 'Button' },
      ],
    },
  }),
};

export const Short: Story = {
  render: () => ({
    template: `<tailwind-breadcrumb [items]="items"></tailwind-breadcrumb>`,
    props: {
      items: [
        { label: 'Dashboard', href: '#' },
        { label: 'Settings' },
      ],
    },
  }),
};

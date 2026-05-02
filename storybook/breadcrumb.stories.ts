import type { Meta, StoryObj } from '@storybook/angular';
import { AtcBreadcrumb } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcBreadcrumb> = {
  title: 'Components/Breadcrumb',
  component: AtcBreadcrumb,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<AtcBreadcrumb>;

export const Default: Story = {
  render: () => ({
    template: `
      <atc-breadcrumb [items]="items"></atc-breadcrumb>`,
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
    template: `<atc-breadcrumb [items]="items"></atc-breadcrumb>`,
    props: {
      items: [
        { label: 'Dashboard', href: '#' },
        { label: 'Settings' },
      ],
    },
  }),
};

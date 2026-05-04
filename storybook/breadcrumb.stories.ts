import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindBreadcrumb } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindBreadcrumb> = {
  title: 'Components/Breadcrumb',
  component: TailwindBreadcrumb,
  tags: ['autodocs'],
  args: {
    ariaLabel: 'Breadcrumb',
    items: [
      { label: 'Home', href: '#' },
      { label: 'Products', href: '#' },
      { label: 'Angular Components', href: '#' },
      { label: 'Button' }
    ]
  }
};
export default meta;

export const Breadcrumb: StoryObj<TailwindBreadcrumb> = {
  render: args => ({
    props: args,
    template: `
      <tailwind-breadcrumb ${argsToTemplate(args)}></tailwind-breadcrumb>`,
    args: {
      ariaLabel: 'Breadcrumb',
      items: [
        { label: 'Home', href: '#' },
        { label: 'Products', href: '#' },
        { label: 'Angular Components', href: '#' },
        { label: 'Button' }
      ]
    }
  })
};

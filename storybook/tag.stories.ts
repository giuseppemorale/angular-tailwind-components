import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { TailwindTag } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindTag> = {
  title: 'Components/Tag',
  component: TailwindTag,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<TailwindTag>;

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-2">
        <tailwind-tag>Default</tailwind-tag>
        <tailwind-tag variant="primary">Primary</tailwind-tag>
        <tailwind-tag variant="success">Success</tailwind-tag>
        <tailwind-tag variant="warning">Warning</tailwind-tag>
        <tailwind-tag variant="danger">Danger</tailwind-tag>
        <tailwind-tag variant="info">Info</tailwind-tag>
      </div>`,
  }),
};

export const WithIcons: Story = {
  render: () => ({
    template: `
      <div class="flex gap-2">
        <tailwind-tag variant="success">Ã¢Å“â€œ Completed</tailwind-tag>
        <tailwind-tag variant="warning">Ã¢Å¡Â  Pending</tailwind-tag>
        <tailwind-tag variant="danger">Ã¢Å“â€” Failed</tailwind-tag>
      </div>`,
  }),
};


export const Interactive: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex flex-wrap gap-2">
        <tailwind-tag ${argsToTemplate(args)}>Default</tailwind-tag>
        <tailwind-tag variant="primary">Primary</tailwind-tag>
        <tailwind-tag variant="success">Success</tailwind-tag>
        <tailwind-tag variant="warning">Warning</tailwind-tag>
        <tailwind-tag variant="danger">Danger</tailwind-tag>
        <tailwind-tag variant="info">Info</tailwind-tag>
      </div>`,
  }),
  args: {
    variant: 'neutral'
  }
};

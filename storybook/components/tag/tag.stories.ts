import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindTag } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindTag> = {
  title: 'Components/Tag',
  component: TailwindTag,
  tags: ['autodocs']
};
export default meta;

export const Tags: StoryObj<TailwindTag> = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-2">
        <tailwind-tag>Default</tailwind-tag>
        <tailwind-tag variant="primary">Primary</tailwind-tag>
        <tailwind-tag variant="success">Success</tailwind-tag>
        <tailwind-tag variant="warning">Warning</tailwind-tag>
        <tailwind-tag variant="danger">Danger</tailwind-tag>
        <tailwind-tag variant="info">Info</tailwind-tag>
      </div>`
  })
};

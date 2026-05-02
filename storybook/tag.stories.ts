import type { Meta, StoryObj } from '@storybook/angular';
import { AtcTag } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcTag> = {
  title: 'Components/Tag',
  component: AtcTag,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<AtcTag>;

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-2">
        <atc-tag>Default</atc-tag>
        <atc-tag variant="primary">Primary</atc-tag>
        <atc-tag variant="success">Success</atc-tag>
        <atc-tag variant="warning">Warning</atc-tag>
        <atc-tag variant="danger">Danger</atc-tag>
        <atc-tag variant="info">Info</atc-tag>
      </div>`,
  }),
};

export const WithIcons: Story = {
  render: () => ({
    template: `
      <div class="flex gap-2">
        <atc-tag variant="success">âœ“ Completed</atc-tag>
        <atc-tag variant="warning">âš  Pending</atc-tag>
        <atc-tag variant="danger">âœ— Failed</atc-tag>
      </div>`,
  }),
};

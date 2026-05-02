import type { Meta, StoryObj } from '@storybook/angular';
import { AtcTabGroup, AtcTab } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta = {
  title: 'Components/Tabs',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `
      <atc-tab-group>
        <atc-tab label="Overview">
          <p class="text-sm text-surface-600">This is the overview tab content.</p>
        </atc-tab>
        <atc-tab label="Features">
          <p class="text-sm text-surface-600">Feature list goes here.</p>
        </atc-tab>
        <atc-tab label="Pricing">
          <p class="text-sm text-surface-600">Pricing information.</p>
        </atc-tab>
        <atc-tab label="Disabled" [disabled]="true">
          <p class="text-sm text-surface-600">You can't see this.</p>
        </atc-tab>
      </atc-tab-group>`,
  }),
};

export const Scrollable: Story = {
  render: () => ({
    template: `
      <div style="max-width:300px">
        <atc-tab-group [scrollable]="true">
          <atc-tab label="Tab One"><p class="text-sm">Content 1</p></atc-tab>
          <atc-tab label="Tab Two"><p class="text-sm">Content 2</p></atc-tab>
          <atc-tab label="Tab Three"><p class="text-sm">Content 3</p></atc-tab>
          <atc-tab label="Tab Four"><p class="text-sm">Content 4</p></atc-tab>
          <atc-tab label="Tab Five"><p class="text-sm">Content 5</p></atc-tab>
        </atc-tab-group>
      </div>`,
  }),
};

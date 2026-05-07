import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';

const meta: Meta = {
  title: 'Components/Tabs',
  parameters: { docs: { story: { height: '300px' } } },
  args: {
    ariaLabel: '',
    scrollable: false
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <tailwind-tab-group ${argsToTemplate(args)}>
        <tailwind-tab label="Overview">
          <p class="text-sm text-surface-600">This is the overview tab content.</p>
        </tailwind-tab>
        <tailwind-tab label="Features">
          <p class="text-sm text-surface-600">Feature list goes here.</p>
        </tailwind-tab>
        <tailwind-tab label="Pricing">
          <p class="text-sm text-surface-600">Pricing information.</p>
        </tailwind-tab>
        <tailwind-tab label="Disabled" [disabled]="true">
          <p class="text-sm text-surface-600">You can't see this.</p>
        </tailwind-tab>
      </tailwind-tab-group>`
  })
};

export const Scrollable: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width:300px">
        <tailwind-tab-group ${argsToTemplate(args)} [scrollable]="true">
          <tailwind-tab label="Tab One"><p class="text-sm">Content 1</p></tailwind-tab>
          <tailwind-tab label="Tab Two"><p class="text-sm">Content 2</p></tailwind-tab>
          <tailwind-tab label="Tab Three"><p class="text-sm">Content 3</p></tailwind-tab>
          <tailwind-tab label="Tab Four"><p class="text-sm">Content 4</p></tailwind-tab>
          <tailwind-tab label="Tab Five"><p class="text-sm">Content 5</p></tailwind-tab>
        </tailwind-tab-group>
      </div>`
  })
};


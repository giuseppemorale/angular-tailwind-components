import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindEmptyState } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindEmptyState> = {
  title: 'Feedback/EmptyState',
  component: TailwindEmptyState,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    compact: { control: 'boolean' },
    headingLevel: { control: 'select', options: [2, 3, 4, 5, 6] }
  }
};
export default meta;

export const EmptyState: StoryObj<TailwindEmptyState> = {
  render: args => ({
    props: args,
    template: `<tailwind-empty-state ${argsToTemplate(args)} />`
  }),
  args: {
    title: 'No invoices yet',
    description: 'Invoices you create will show up here.',
    icon: 'document-text',
    compact: false,
    headingLevel: 3
  }
};

export const WithAction: StoryObj<TailwindEmptyState> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <tailwind-empty-state title="No results" description="Try a different search term." icon="magnifying-glass">
        <tailwind-button color="primary" size="sm">Clear filters</tailwind-button>
      </tailwind-empty-state>`
  })
};

export const Compact: StoryObj<TailwindEmptyState> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="rounded-xl border border-neutral-200">
        <tailwind-empty-state title="Nothing to show" [compact]="true" icon="inbox" />
      </div>`
  })
};

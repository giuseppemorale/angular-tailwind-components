import type { Meta, StoryObj } from '@storybook/angular';

type AccordionItemsArgs = {
  items: Array<{ title: string; content: string; disabled: boolean }>;
};

const meta: Meta<AccordionItemsArgs> = {
  title: 'Components/Accordion',
  parameters: { docs: { story: { height: '300px' } } },
  argTypes: {
    items: { control: 'object', table: { category: 'Items' } }
  }
};
export default meta;

export const Usage: StoryObj = {
  tags: ['!dev'],
  render: () => ({
    template: `
      <tailwind-accordion>
        <tailwind-accordion-item title="What is Angular?">
          Angular is a platform and framework for building client-side applications using HTML, CSS, and TypeScript.
        </tailwind-accordion-item>
        <tailwind-accordion-item title="What is Tailwind CSS?">
          Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.
        </tailwind-accordion-item>
        <tailwind-accordion-item title="How do I get started?">
          Install the library via npm and import the components you need in your Angular module or standalone component.
        </tailwind-accordion-item>
      </tailwind-accordion>`
  })
};

export const AccordionItems: StoryObj<AccordionItemsArgs> = {
  render: args => ({
    props: args,
    template: `
      <tailwind-accordion>
        @for (item of items; track item) {
          <tailwind-accordion-item [title]="item.title" [disabled]="item.disabled">
            {{ item.content }}
          </tailwind-accordion-item>
        }
      </tailwind-accordion>`
  }),
  args: {
    items: [
      {
        title: 'What is Angular?',
        content:
          'Angular is a platform and framework for building client-side applications using HTML, CSS, and TypeScript.',
        disabled: false
      },
      {
        title: 'What is Tailwind CSS?',
        content: 'Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.',
        disabled: false
      },
      {
        title: 'How do I get started?',
        content:
          'Install the library via npm and import the components you need in your Angular module or standalone component.',
        disabled: false
      }
    ]
  }
};

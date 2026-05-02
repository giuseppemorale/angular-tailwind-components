import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';

const meta: Meta = {
  title: 'Components/Accordion',
  tags: ['autodocs'],
  parameters: { docs: { story: { height: '300px' } } },
  args: {
    multiple: false
  }
};
export default meta;
type Story = StoryObj;

export const Accordion: Story = {
  render: args => ({
    template: `
      <tailwind-accordion ${argsToTemplate(args)}>
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
  }),
  args: {
    multiple: false
  }
};

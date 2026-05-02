import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindAccordion, TailwindAccordionItem } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta = {
  title: 'Components/Accordion',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `
      <tailwind-accordion style="max-width:600px">
        <tailwind-accordion-item title="What is Angular?">
          Angular is a platform and framework for building client-side applications using HTML, CSS, and TypeScript.
        </tailwind-accordion-item>
        <tailwind-accordion-item title="What is Tailwind CSS?">
          Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.
        </tailwind-accordion-item>
        <tailwind-accordion-item title="How do I get started?">
          Install the library via npm and import the components you need in your Angular module or standalone component.
        </tailwind-accordion-item>
      </tailwind-accordion>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <tailwind-accordion style="max-width:600px">
        <tailwind-accordion-item title="Available section">
          This section is available to interact with.
        </tailwind-accordion-item>
        <tailwind-accordion-item title="Disabled section" [disabled]="true">
          This content won't show.
        </tailwind-accordion-item>
      </tailwind-accordion>`,
  }),
};

import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindForm } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta = {
  title: 'Components/Form',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const BasicForm: Story = {
  render: () => ({
    template: `
      <tailwind-form style="max-width:480px">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <tailwind-input label="First Name" placeholder="John" />
            <tailwind-input label="Last Name" placeholder="Doe" />
          </div>
          <tailwind-input label="Email" type="email" placeholder="john@example.com" />
          <tailwind-select label="Country" [options]="[{value:'it',label:'Italy'},{value:'us',label:'United States'},{value:'uk',label:'United Kingdom'}]" />
          <tailwind-toggle label="Subscribe to newsletter" />
          <tailwind-checkbox label="I accept the terms and conditions" />
          <div class="flex justify-end gap-3 pt-2">
            <tailwind-button variant="ghost">Cancel</tailwind-button>
            <tailwind-button>Submit</tailwind-button>
          </div>
        </div>
      </tailwind-form>`,
  }),
};

export const ContactForm: Story = {
  render: () => ({
    template: `
      <tailwind-form style="max-width:480px">
        <h2 class="text-lg font-semibold mb-4">Contact Us</h2>
        <div class="space-y-4">
          <tailwind-input label="Name" placeholder="Your name" />
          <tailwind-input label="Email" type="email" placeholder="your@email.com" />
          <tailwind-select label="Subject" [options]="[{value:'support',label:'Support'},{value:'sales',label:'Sales'},{value:'other',label:'Other'}]" />
          <tailwind-input label="Message" placeholder="How can we help?" />
          <tailwind-button class="w-full">Send Message</tailwind-button>
        </div>
      </tailwind-form>`,
  }),
};

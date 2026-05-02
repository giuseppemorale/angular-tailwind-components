import type { Meta, StoryObj } from '@storybook/angular';
import { AtcForm } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta = {
  title: 'Components/Form',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const BasicForm: Story = {
  render: () => ({
    template: `
      <atc-form style="max-width:480px">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <atc-input label="First Name" placeholder="John" />
            <atc-input label="Last Name" placeholder="Doe" />
          </div>
          <atc-input label="Email" type="email" placeholder="john@example.com" />
          <atc-select label="Country" [options]="[{value:'it',label:'Italy'},{value:'us',label:'United States'},{value:'uk',label:'United Kingdom'}]" />
          <atc-toggle label="Subscribe to newsletter" />
          <atc-checkbox label="I accept the terms and conditions" />
          <div class="flex justify-end gap-3 pt-2">
            <atc-button variant="ghost">Cancel</atc-button>
            <atc-button>Submit</atc-button>
          </div>
        </div>
      </atc-form>`,
  }),
};

export const ContactForm: Story = {
  render: () => ({
    template: `
      <atc-form style="max-width:480px">
        <h2 class="text-lg font-semibold mb-4">Contact Us</h2>
        <div class="space-y-4">
          <atc-input label="Name" placeholder="Your name" />
          <atc-input label="Email" type="email" placeholder="your@email.com" />
          <atc-select label="Subject" [options]="[{value:'support',label:'Support'},{value:'sales',label:'Sales'},{value:'other',label:'Other'}]" />
          <atc-input label="Message" placeholder="How can we help?" />
          <atc-button class="w-full">Send Message</atc-button>
        </div>
      </atc-form>`,
  }),
};

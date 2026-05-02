import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindStepper, TailwindStep } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta = {
  title: 'Components/Stepper',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `
      <tailwind-stepper>
        <tailwind-step label="Account" description="Create your account">
          <div class="space-y-3">
            <tailwind-input label="Email" placeholder="email@example.com" />
            <tailwind-input label="Password" type="password" placeholder="Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢" />
          </div>
        </tailwind-step>
        <tailwind-step label="Profile" description="Set up your profile">
          <div class="space-y-3">
            <tailwind-input label="Full Name" placeholder="John Doe" />
            <tailwind-input label="Bio" placeholder="Tell us about yourself" />
          </div>
        </tailwind-step>
        <tailwind-step label="Review" description="Review & confirm">
          <p class="text-sm text-surface-600">Review your details before submitting.</p>
        </tailwind-step>
      </tailwind-stepper>`,
  }),
};

export const Linear: Story = {
  render: () => ({
    template: `
      <tailwind-stepper [linear]="true">
        <tailwind-step label="Step 1">Content for step 1</tailwind-step>
        <tailwind-step label="Step 2">Content for step 2</tailwind-step>
        <tailwind-step label="Step 3">Content for step 3</tailwind-step>
      </tailwind-stepper>`,
  }),
};

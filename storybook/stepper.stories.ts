import type { Meta, StoryObj } from '@storybook/angular';
import { AtcStepper, AtcStep } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta = {
  title: 'Components/Stepper',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `
      <atc-stepper>
        <atc-step label="Account" description="Create your account">
          <div class="space-y-3">
            <atc-input label="Email" placeholder="email@example.com" />
            <atc-input label="Password" type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" />
          </div>
        </atc-step>
        <atc-step label="Profile" description="Set up your profile">
          <div class="space-y-3">
            <atc-input label="Full Name" placeholder="John Doe" />
            <atc-input label="Bio" placeholder="Tell us about yourself" />
          </div>
        </atc-step>
        <atc-step label="Review" description="Review & confirm">
          <p class="text-sm text-surface-600">Review your details before submitting.</p>
        </atc-step>
      </atc-stepper>`,
  }),
};

export const Linear: Story = {
  render: () => ({
    template: `
      <atc-stepper [linear]="true">
        <atc-step label="Step 1">Content for step 1</atc-step>
        <atc-step label="Step 2">Content for step 2</atc-step>
        <atc-step label="Step 3">Content for step 3</atc-step>
      </atc-stepper>`,
  }),
};

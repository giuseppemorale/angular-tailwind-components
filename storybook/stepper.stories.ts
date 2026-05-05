import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindStepper } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta = {
  title: 'Components/Stepper',
  component: TailwindStepper,
  tags: ['autodocs'],
  parameters: { docs: { story: { height: '350px' } } }
};
export default meta;

export const Stepper: StoryObj<TailwindStepper> = {
  render: () => ({
    template: `
      <tailwind-stepper>
        <tailwind-step label="Account" description="Create your account">
          <div class="space-y-3">
            <tailwind-input label="Email" placeholder="email@example.com" />
            <tailwind-input label="Password" type="password" placeholder="Type here your password" />
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
      </tailwind-stepper>`
  })
};

export const Linear: StoryObj<TailwindStepper> = {
  render: () => ({
    template: `
      <tailwind-stepper #stepper [linear]="true">
        <tailwind-step label="Data">
          <tailwind-button (onClick)="stepper.next()">Go Next</tailwind-button>
        </tailwind-step>
        <tailwind-step label="Profile">
          <tailwind-button (onClick)="stepper.next()">Go Review</tailwind-button>
        </tailwind-step>
        <tailwind-step label="Review">
          Finished
        </tailwind-step>
      </tailwind-stepper>`
  })
};

import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindStepper } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindStepper> = {
  title: 'Components/Stepper',
  component: TailwindStepper,
  parameters: { docs: { story: { height: '350px' } } },
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'transparent']
    }
  }
};
export default meta;

export const Stepper: StoryObj<TailwindStepper> = {
  args: { color: 'primary', linear: false },
  render: args => ({
    props: args,
    template: `
      <tailwind-stepper [color]="color" [linear]="linear">
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
          <p class="text-sm text-neutral-600">Review your details before submitting.</p>
        </tailwind-step>
      </tailwind-stepper>`
  })
};

export const Colors: StoryObj<TailwindStepper> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex flex-col gap-10">
        <tailwind-stepper color="primary" [activeIndex]="1">
          <tailwind-step label="Primary" description="Default accent" />
          <tailwind-step label="Step 2" description="Active" />
          <tailwind-step label="Step 3" description="Pending" />
        </tailwind-stepper>
        <tailwind-stepper color="success" [activeIndex]="1">
          <tailwind-step label="Success" description="Completed flow" />
          <tailwind-step label="Step 2" description="Active" />
          <tailwind-step label="Step 3" description="Pending" />
        </tailwind-stepper>
        <tailwind-stepper color="danger" [activeIndex]="2">
          <tailwind-step label="Danger" description="Done" />
          <tailwind-step label="Step 2" description="Done" />
          <tailwind-step label="Step 3" description="Active" />
        </tailwind-stepper>
      </div>`
  })
};

export const Linear: StoryObj<TailwindStepper> = {
  parameters: { controls: { exclude: ['linear'] } },
  args: { color: 'primary' },
  render: args => ({
    props: args,
    template: `
      <tailwind-stepper #stepper [linear]="true" [color]="color">
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

import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindRadioGroup } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindRadioGroup> = {
  title: 'Forms/RadioGroup',
  component: TailwindRadioGroup,
  tags: ['autodocs']
};
export default meta;

export const RadioGroup: StoryObj<TailwindRadioGroup> = {
  args: {
    label: 'Plan',
    options: [
      { value: 'free', label: 'Free plan $0/month' },
      { value: 'pro', label: 'Pro plan $12/month' },
      { value: 'enterprise', label: 'Enterprise plan Contact us' }
    ]
  }
};

export const Horizontal: StoryObj<TailwindRadioGroup> = {
  args: {
    orientation: 'horizontal',
    options: [
      { value: 'sm', label: 'S' },
      { value: 'md', label: 'M' },
      { value: 'lg', label: 'L' },
      { value: 'xl', label: 'XL' }
    ]
  }
};

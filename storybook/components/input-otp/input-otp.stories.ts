import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindInputOtp } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindInputOtp> = {
  title: 'Forms/Input OTP',
  component: TailwindInputOtp,
  argTypes: {
    length: { control: { type: 'number', min: 1, max: 12 } },
    integerOnly: { control: 'boolean' },
    mask: { control: 'boolean' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    readonly: { control: 'boolean' },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
    hasError: { control: 'boolean' },
    separator: { control: 'text' },
    separatorAfterIndex: { control: 'number' }
  }
};
export default meta;

export const OTP: StoryObj<TailwindInputOtp> = {
  args: {
    label: 'Verification code',
    length: 6,
    integerOnly: true,
    mask: false,
    size: 'md',
    readonly: false,
    helperText: 'Enter the 6-digit code we sent you.',
    hasError: false,
    errorText: '',
    separator: '',
    separatorAfterIndex: null
  }
};

export const WithSeparator: StoryObj<TailwindInputOtp> = {
  args: {
    ...OTP.args,
    label: 'OTP',
    separator: '-',
    separatorAfterIndex: 2,
    helperText: 'Format xxx-xxx'
  }
};

export const Masked: StoryObj<TailwindInputOtp> = {
  args: {
    ...OTP.args,
    label: 'PIN',
    mask: true,
    helperText: 'Digits are hidden'
  }
};

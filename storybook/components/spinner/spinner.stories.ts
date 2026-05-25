import type { Meta, StoryObj } from '@storybook/angular';
import { TAILWIND_PALETTES, TailwindSpinner } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindSpinner> = {
  title: 'Components/Spinner',
  component: TailwindSpinner,
  argTypes: {
    size: {
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      control: { type: 'select' }
    },
    color: {
      options: [...TAILWIND_PALETTES],
      control: { type: 'select' }
    },
    label: { control: 'text' },
    ariaLabel: { control: 'text' },
    orientation: {
      options: ['horizontal', 'vertical'],
      control: { type: 'select' }
    }
  }
};
export default meta;

export const Spinner: StoryObj<TailwindSpinner> = {
  args: {
    size: 'md',
    color: 'blue',
    label: '',
    ariaLabel: 'Loading',
    orientation: 'horizontal'
  }
};

export const WithLabel: StoryObj<TailwindSpinner> = {
  args: {
    size: 'md',
    color: 'blue',
    label: 'Loading data...',
    ariaLabel: 'Loading',
    orientation: 'horizontal'
  }
};

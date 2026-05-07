import { type Meta, type StoryObj } from '@storybook/angular';
import { TailwindToggle } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindToggle> = {
  title: 'Forms/Toggle',
  component: TailwindToggle,
  argTypes: {
    label: { control: 'text' },
    ariaLabel: { control: 'text' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] }
  }
};
export default meta;

export const Toggle: StoryObj<TailwindToggle> = {
  args: {
    label: 'Enable notifications',
    ariaLabel: 'Toggle notifications',
    size: 'md'
  }
};

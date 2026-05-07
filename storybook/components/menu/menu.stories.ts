import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindMenu } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindMenu> = {
  title: 'Components/Menu',
  component: TailwindMenu,
  parameters: { docs: { story: { height: '320px' } } },
  args: {
    items: [],
    align: 'left'
  }
};
export default meta;
type Story = StoryObj<TailwindMenu>;

export const Menu: Story = {
  render: args => ({
    props: args,
    template: `
      <tailwind-menu ${argsToTemplate(args)}>
        <tailwind-menu-trigger>
          <tailwind-button>Open Menù</tailwind-button>
        </tailwind-menu-trigger>
      </tailwind-menu>
      `
  }),
  args: {
    items: [
      { label: 'Profile', value: 'profile' },
      { label: 'Settings', value: 'settings' },
      { label: 'Help', value: 'help' },
      { divider: true },
      { label: 'Sign out', value: 'signout' }
    ]
  }
};

import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindAvatar } from '../../../projects/angular-tailwind-components/src/public-api';

const STATUS_COLORS = [undefined, 'primary', 'secondary', 'success', 'warning', 'danger', 'info', 'transparent'] as const;

const meta: Meta<TailwindAvatar> = {
  title: 'Components/Avatar',
  component: TailwindAvatar,
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'transparent']
    },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'select', options: ['circle', 'rounded'] },
    status: {
      control: 'select',
      options: [...STATUS_COLORS]
    }
  }
};
export default meta;

export const Avatar: StoryObj<TailwindAvatar> = {
  render: args => ({
    props: args,
    template: `<tailwind-avatar ${argsToTemplate(args)} />`
  }),
  args: {
    name: 'Giuseppe Morale',
    size: 'md',
    shape: 'circle',
    color: 'secondary'
  }
};

export const WithImage: StoryObj<TailwindAvatar> = {
  name: 'Con immagine',
  args: {
    src: 'https://i.pravatar.cc/150?u=angular-tailwind',
    alt: 'User avatar',
    size: 'lg',
    status: 'success'
  }
};

export const Sizes: StoryObj<TailwindAvatar> = {
  name: 'Dimensioni',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex items-end gap-3">
        <tailwind-avatar name="Giuseppe Morale" size="xs" />
        <tailwind-avatar name="Giuseppe Morale" size="sm" />
        <tailwind-avatar name="Giuseppe Morale" size="md" />
        <tailwind-avatar name="Giuseppe Morale" size="lg" />
        <tailwind-avatar name="Giuseppe Morale" size="xl" />
      </div>
    `
  })
};

export const Statuses: StoryObj<TailwindAvatar> = {
  name: 'Status',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex items-center gap-4">
        <tailwind-avatar name="Success" status="success" />
        <tailwind-avatar name="Warning" status="warning" />
        <tailwind-avatar name="Danger" status="danger" />
        <tailwind-avatar name="Info" status="info" />
        <tailwind-avatar name="Primary" status="primary" />
        <tailwind-avatar name="Secondary" status="secondary" />
      </div>
    `
  })
};

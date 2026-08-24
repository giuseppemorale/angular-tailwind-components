import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindKbd } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindKbd> = {
  title: 'Display/Kbd',
  component: TailwindKbd,
  argTypes: {
    separator: { control: 'text' }
  }
};
export default meta;

export const Kbd: StoryObj<TailwindKbd> = {
  render: args => ({
    props: args,
    template: `<tailwind-kbd ${argsToTemplate(args)} />`
  }),
  args: { keys: ['Ctrl', 'K'], separator: '+' }
};

export const SingleKey: StoryObj<TailwindKbd> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<p class="text-sm text-neutral-600">Press <tailwind-kbd>Esc</tailwind-kbd> to close.</p>`
  })
};

export const Chords: StoryObj<TailwindKbd> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex flex-col gap-3 text-sm">
        <span>Search: <tailwind-kbd [keys]="['Ctrl', 'K']" /></span>
        <span>Save: <tailwind-kbd [keys]="['Ctrl', 'S']" /></span>
        <span>Sequence: <tailwind-kbd [keys]="['G', 'P']" separator="then" /></span>
      </div>`
  })
};

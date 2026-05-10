import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TAILWIND_SOLAR_ICON_NAMES, TailwindTitle } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindTitle> = {
  title: 'Components/Title',
  component: TailwindTitle,
  argTypes: {
    titleTag: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    },
    icon: {
      control: 'select',
      options: TAILWIND_SOLAR_ICON_NAMES
    }
  }
};
export default meta;

export const Title: StoryObj<TailwindTitle> = {
  render: args => ({
    props: args,
    template: `<tailwind-title ${argsToTemplate(args)} />`
  }),
  args: {
    titleTag: 'h2',
    text: 'Section heading'
  }
};

export const WithIcon: StoryObj<TailwindTitle> = {
  parameters: {
    docs: {
      description: {
        story: 'Con `icon` impostato, l’icona Solar Line Duotone viene mostrata prima del testo.'
      }
    }
  },
  render: args => ({
    props: args,
    template: `<tailwind-title ${argsToTemplate(args)} />`
  }),
  args: {
    titleTag: 'h2',
    text: 'Dashboard',
    icon: 'home-2'
  }
};

export const HeadingLevels: StoryObj<TailwindTitle> = {
  parameters: {
    docs: {
      description: {
        story: 'Scala tipografica predefinita per ogni `titleTag` (`h1`–`h6`).'
      }
    }
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-6 max-w-xl">
        <tailwind-title titleTag="h1" text="Heading level 1" />
        <tailwind-title titleTag="h2" text="Heading level 2" />
        <tailwind-title titleTag="h3" text="Heading level 3" />
        <tailwind-title titleTag="h4" text="Heading level 4" />
        <tailwind-title titleTag="h5" text="Heading level 5" />
        <tailwind-title titleTag="h6" text="Heading level 6" />
      </div>
    `
  })
};

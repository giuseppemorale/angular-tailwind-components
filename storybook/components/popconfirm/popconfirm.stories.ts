import { type Meta, type StoryObj } from '@storybook/angular';
import { TailwindPopconfirm } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindPopconfirm> = {
  title: 'Overlay/Popconfirm',
  component: TailwindPopconfirm,
  argTypes: {
    message: { control: 'text' },
    position: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    confirmColor: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info']
    },
    confirmLabel: { control: 'text' },
    cancelLabel: { control: 'text' }
  }
};
export default meta;

export const Popconfirm: StoryObj<TailwindPopconfirm> = {
  render: args => ({
    props: args,
    template: `
      <div class="flex justify-center py-16">
        <tailwind-button color="danger" (click)="confirm.toggle($event)">Delete</tailwind-button>
        <tailwind-popconfirm
          #confirm
          [message]="message"
          [position]="position"
          [confirmColor]="confirmColor"
          [confirmLabel]="confirmLabel"
          [cancelLabel]="cancelLabel" />
      </div>`
  }),
  args: { message: 'Delete this item? This cannot be undone.', position: 'top', confirmColor: 'danger' }
};

export const InATable: StoryObj<TailwindPopconfirm> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <ul class="max-w-sm divide-y divide-neutral-200 rounded-lg border border-neutral-200">
        <li class="flex items-center justify-between p-3">
          <span class="text-sm">INV-0041</span>
          <tailwind-button size="sm" kind="ghost" color="danger" (click)="one.toggle($event)">Delete</tailwind-button>
          <tailwind-popconfirm #one message="Delete INV-0041?" position="left" />
        </li>
        <li class="flex items-center justify-between p-3">
          <span class="text-sm">INV-0042</span>
          <tailwind-button size="sm" kind="ghost" color="danger" (click)="two.toggle($event)">Delete</tailwind-button>
          <tailwind-popconfirm #two message="Delete INV-0042?" position="left" />
        </li>
      </ul>`
  })
};

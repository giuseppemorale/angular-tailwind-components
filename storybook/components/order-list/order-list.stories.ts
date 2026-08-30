import { type Meta, type StoryObj } from '@storybook/angular';
import { TailwindOrderList } from '../../../projects/angular-tailwind-components/src/public-api';

interface Track {
  id: number;
  title: string;
  artist: string;
}

const TRACKS: Track[] = [
  { id: 1, title: 'Midnight City', artist: 'M83' },
  { id: 2, title: 'Time', artist: 'Hans Zimmer' },
  { id: 3, title: 'Intro', artist: 'The xx' },
  { id: 4, title: 'Nightcall', artist: 'Kavinsky' },
  { id: 5, title: 'Genesis', artist: 'Justice' },
  { id: 6, title: 'Emerge', artist: 'Fischerspooner' }
];

const meta: Meta<TailwindOrderList<Track>> = {
  title: 'Display/Order List',
  component: TailwindOrderList,
  args: {
    items: [...TRACKS],
    optionLabel: 'title',
    dataKey: 'id',
    header: 'Playlist',
    size: 'md',
    disabled: false,
    dragdrop: true,
    filterable: false,
    controlsPosition: 'left',
    scrollHeight: '16rem'
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    controlsPosition: { control: 'inline-radio', options: ['left', 'right'] }
  }
};
export default meta;

export const OrderList: StoryObj<TailwindOrderList<Track>> = {
  parameters: { controls: { exclude: ['filterLabel', 'filterPlaceholder', 'emptyMessage', 'ariaLabel'] } },
  render: args => ({
    props: args,
    template: `
      <div class="max-w-md">
        <tailwind-order-list
          [items]="items"
          [optionLabel]="optionLabel"
          [dataKey]="dataKey"
          [header]="header"
          [size]="size"
          [disabled]="disabled"
          [dragdrop]="dragdrop"
          [filterable]="filterable"
          [controlsPosition]="controlsPosition"
          [scrollHeight]="scrollHeight" />
      </div>`
  })
};

export const WithFilter: StoryObj<TailwindOrderList<Track>> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { items: [...TRACKS] },
    template: `
      <div class="max-w-md">
        <tailwind-order-list
          [items]="items"
          optionLabel="title"
          dataKey="id"
          header="Playlist"
          [filterable]="true"
          scrollHeight="14rem" />
      </div>`
  })
};

export const CustomTemplate: StoryObj<TailwindOrderList<Track>> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { items: [...TRACKS] },
    template: `
      <div class="max-w-md">
        <tailwind-order-list [items]="items" optionLabel="title" dataKey="id" header="Playlist">
          <ng-template #item let-track let-selected="selected">
            <span class="min-w-0 flex-1 truncate">{{ track.title }}</span>
            <span class="shrink-0 text-xs" [class.text-primary-600]="selected" [class.text-fg-muted]="!selected">
              {{ track.artist }}
            </span>
          </ng-template>
        </tailwind-order-list>
      </div>`
  })
};

export const ControlsOnTheRight: StoryObj<TailwindOrderList<Track>> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { items: [...TRACKS] },
    template: `
      <div class="max-w-md">
        <tailwind-order-list
          [items]="items"
          optionLabel="title"
          dataKey="id"
          header="Playlist"
          controlsPosition="right"
          scrollHeight="12rem" />
      </div>`
  })
};

export const PlainStrings: StoryObj<TailwindOrderList<string>> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { items: ['Draft', 'In review', 'Approved', 'Published'] },
    template: `
      <div class="max-w-sm">
        <tailwind-order-list [items]="items" header="Workflow" size="sm" [dragdrop]="false" />
      </div>`
  })
};

export const Disabled: StoryObj<TailwindOrderList<Track>> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { items: [...TRACKS] },
    template: `
      <div class="max-w-md">
        <tailwind-order-list
          [items]="items"
          optionLabel="title"
          dataKey="id"
          header="Playlist"
          [disabled]="true"
          scrollHeight="12rem" />
      </div>`
  })
};

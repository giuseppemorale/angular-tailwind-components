import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { TailwindPagination } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindPagination> = {
  title: 'Components/Pagination',
  component: TailwindPagination,
  tags: ['autodocs'],
  argTypes: {
    totalItems: { control: 'number' },
    pageSize: { control: 'number' },
    currentPage: { control: 'number' },
    showSummary: { control: 'boolean' },
  },
  args: {
    pageSize: 10,
    maxVisible: 7,
    ariaLabel: 'Pagination',
    showSummary: false,
    summaryTemplate: 'Showing {start}-{end} of {total}',
    totalItems: 0
  },
};
export default meta;
type Story = StoryObj<TailwindPagination>;

export const Default: Story = {
  render: () => ({
    props: { totalItems: 100, pageSize: 10, currentPage: 1 },
    template: `<tailwind-pagination [totalItems]="totalItems" [pageSize]="pageSize" [(currentPage)]="currentPage"></tailwind-pagination>`,
  }),
};

export const WithSummary: Story = {
  render: () => ({
    props: { totalItems: 100, pageSize: 10, currentPage: 1 },
    template: `<tailwind-pagination [totalItems]="totalItems" [pageSize]="pageSize" [(currentPage)]="currentPage" [showSummary]="true"></tailwind-pagination>`,
  }),
};

export const ManyPages: Story = {
  render: () => ({
    props: { totalItems: 500, pageSize: 10, currentPage: 25 },
    template: `<tailwind-pagination [totalItems]="totalItems" [pageSize]="pageSize" [(currentPage)]="currentPage" [showSummary]="true"></tailwind-pagination>`,
  }),
};



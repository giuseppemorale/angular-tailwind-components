import type { Meta, StoryObj } from '@storybook/angular';
import { AtcTable } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcTable> = {
  title: 'Components/Table',
  component: AtcTable,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<AtcTable>;

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
];

const rows = [
  { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
  { name: 'David Brown', email: 'david@example.com', role: 'Editor', status: 'Active' },
];

export const Default: Story = {
  render: () => ({
    props: { columns, rows },
    template: `<atc-table [columns]="columns" [rows]="rows"></atc-table>`,
  }),
};

export const Striped: Story = {
  render: () => ({
    props: { columns, rows },
    template: `<atc-table [columns]="columns" [rows]="rows" [striped]="true"></atc-table>`,
  }),
};

export const Loading: Story = {
  render: () => ({
    props: { columns, rows: [] },
    template: `<atc-table [columns]="columns" [rows]="rows" [loading]="true"></atc-table>`,
  }),
};

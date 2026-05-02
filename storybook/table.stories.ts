import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindTable } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindTable> = {
  title: 'Components/Table',
  component: TailwindTable,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<TailwindTable>;

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' }
];

const rows = [
  { name: 'Alice Johnson', email: 'alice.johnson@example.com', role: 'Admin', status: 'Active' },
  { name: 'Bob Smith', email: 'bob.smith@example.com', role: 'Editor', status: 'Active' },
  { name: 'Carol White', email: 'carol.white@example.com', role: 'Viewer', status: 'Inactive' },
  { name: 'David Brown', email: 'david.brown@example.com', role: 'Editor', status: 'Active' },
  { name: 'Eve Davis', email: 'eve.davis@example.com', role: 'Viewer', status: 'Active' },
  { name: 'Frank Miller', email: 'frank.miller@example.com', role: 'Editor', status: 'Inactive' },
  { name: 'Grace Wilson', email: 'grace.wilson@example.com', role: 'Viewer', status: 'Active' },
  { name: 'Henry Moore', email: 'henry.moore@example.com', role: 'Viewer', status: 'Active' },
  { name: 'Isabella Taylor', email: 'isabella.taylor@example.com', role: 'Admin', status: 'Active' },
  { name: 'Jack Anderson', email: 'jack.anderson@example.com', role: 'Editor', status: 'Inactive' },
  { name: 'Karen Thomas', email: 'karen.thomas@example.com', role: 'Viewer', status: 'Active' },
  { name: 'Liam Jackson', email: 'liam.jackson@example.com', role: 'Viewer', status: 'Active' },
  { name: 'Mia White', email: 'mia.white@example.com', role: 'Editor', status: 'Inactive' },
  { name: 'Noah Harris', email: 'noah.harris@example.com', role: 'Admin', status: 'Active' },
  { name: 'Olivia Martin', email: 'olivia.martin@example.com', role: 'Viewer', status: 'Active' },
  { name: 'Paul Thompson', email: 'paul.thompson@example.com', role: 'Editor', status: 'Active' },
  { name: 'Quinn Garcia', email: 'quinn.garcia@example.com', role: 'Viewer', status: 'Inactive' },
  { name: 'Rachel Martinez', email: 'rachel.martinez@example.com', role: 'Viewer', status: 'Active' },
  { name: 'Samuel Robinson', email: 'samuel.robinson@example.com', role: 'Editor', status: 'Active' },
  { name: 'Tina Clark', email: 'tina.clark@example.com', role: 'Viewer', status: 'Active' },
  { name: 'Ursula Rodriguez', email: 'ursula.rodriguez@example.com', role: 'Admin', status: 'Inactive' },
  { name: 'Victor Lewis', email: 'victor.lewis@example.com', role: 'Editor', status: 'Active' },
  { name: 'Wendy Lee', email: 'wendy.lee@example.com', role: 'Viewer', status: 'Active' },
  { name: 'Xander Walker', email: 'xander.walker@example.com', role: 'Viewer', status: 'Inactive' },
  { name: 'Yvonne Hall', email: 'yvonne.hall@example.com', role: 'Editor', status: 'Active' },
  { name: 'Zack Allen', email: 'zack.allen@example.com', role: 'Viewer', status: 'Active' }
];

export const Default: Story = {
  render: () => ({
    props: { columns, rows },
    template: `<tailwind-table [columns]="columns" [data]="rows"></tailwind-table>`
  })
};

export const Striped: Story = {
  render: () => ({
    props: { columns, rows },
    template: `<tailwind-table [columns]="columns" [data]="rows" [striped]="true"></tailwind-table>`
  })
};

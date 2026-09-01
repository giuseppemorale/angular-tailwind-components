import { type Meta, type StoryObj } from '@storybook/angular';
import { TailwindTree, type TailwindTreeNode } from '../../../projects/angular-tailwind-components/src/public-api';

const NODES: TailwindTreeNode[] = [
  {
    key: 'src',
    label: 'src',
    icon: 'folder',
    children: [
      {
        key: 'app',
        label: 'app',
        icon: 'folder',
        children: [
          { key: 'app.component.ts', label: 'app.component.ts', icon: 'document' },
          { key: 'app.config.ts', label: 'app.config.ts', icon: 'document' }
        ]
      },
      { key: 'main.ts', label: 'main.ts', icon: 'document' },
      { key: 'styles.css', label: 'styles.css', icon: 'document' }
    ]
  },
  { key: 'package.json', label: 'package.json', icon: 'document' },
  { key: 'node_modules', label: 'node_modules', icon: 'folder', disabled: true, children: [] }
];

const meta: Meta<TailwindTree> = {
  title: 'Navigation/Tree',
  component: TailwindTree
};
export default meta;

export const Tree: StoryObj<TailwindTree> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { nodes: NODES },
    template: `
      <div class="max-w-xs">
        <tailwind-tree [nodes]="nodes" ariaLabel="Project files" />
      </div>`
  })
};

export const PreExpanded: StoryObj<TailwindTree> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { nodes: NODES, expanded: new Set(['src', 'src/app']) },
    template: `
      <div class="max-w-xs">
        <tailwind-tree [nodes]="nodes" [expandedKeys]="expanded" ariaLabel="Project files" />
      </div>`
  })
};

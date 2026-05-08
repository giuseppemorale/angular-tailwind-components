import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/angular';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '../../../public');

const config: StorybookConfig = {
  stories: ['../../../storybook/**/*.mdx', '../../../storybook/**/*.stories.@(ts|tsx)'],
  staticDirs: [{ from: publicDir, to: '/' }],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/angular',
    options: {}
  }
};

export default config;

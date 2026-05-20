import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/angular';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '../../../public');
const isStackblitz = process.env['STACKBLITZ'] === 'true';

const config: StorybookConfig = {
  stories: isStackblitz
    ? ['../../../storybook/**/*.stories.ts']
    : ['../../../storybook/**/*.mdx', '../../../storybook/**/*.stories.@(ts|tsx)'],
  staticDirs: [{ from: publicDir, to: '/' }],
  addons: isStackblitz
    ? ['@storybook/addon-docs']
    : ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/angular',
    options: {}
  },
  webpackFinal: async (config) => {
    if (!isStackblitz) {
      return config;
    }

    config.plugins = (config.plugins ?? []).filter(
      (plugin) => plugin?.constructor?.name !== 'ForkTsCheckerWebpackPlugin'
    );

    return config;
  }
};

export default config;

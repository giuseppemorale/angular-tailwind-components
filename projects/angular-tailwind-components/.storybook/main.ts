import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@analogjs/storybook-angular';
import type { UserConfig } from 'vite';
import { mergeConfig } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '../../../public');

const config: StorybookConfig = {
  stories: ['../../../storybook/**/*.mdx', '../../../storybook/**/*.stories.@(ts|tsx)'],
  staticDirs: [join(publicDir)],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@analogjs/storybook-angular',
    options: {}
  },
  async viteFinal(config: UserConfig) {
    return mergeConfig(config, {
      plugins: [viteTsConfigPaths()]
    });
  }
};

export default config;

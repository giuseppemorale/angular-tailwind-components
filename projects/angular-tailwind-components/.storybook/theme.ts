import { create } from 'storybook/theming';

const brandTitle = [
  '<span class="atc-storybook-brand">',
  '<img src="/logo.png" width="32" height="32" alt="Logo Angular Tailwind Components" />',
  '<div class="atc-storybook-brand__content">',
  '<span class="atc-storybook-brand__title">Angular Tailwind</span>',
  '<span class="atc-storybook-brand__subtitle">Components</span>',
  '</div>',
  '</span>'
].join('');

export default create({
  base: 'light',
  brandTitle,
  brandUrl: 'https://github.com/giuseppemorale/angular-tailwind-components',
  // null enables HTML brandTitle (logo + text side by side)
  brandImage: null as unknown as string,
  brandTarget: '_self'
});

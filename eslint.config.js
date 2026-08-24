// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    ignores: ['dist/**', 'storybook-static/**', 'node_modules/**', '.angular/**']
  },
  {
    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      // The library's public surface is `tailwind-*` elements and `Tailwind*` classes.
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: ['tailwind', 'tw'], style: 'camelCase' }
      ],
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'tailwind', style: 'kebab-case' }],
      // Public API conventions predating this config. Renaming `onClick`/`onSelect` outputs and the
      // `class` input alias is a breaking change, tracked for the next major rather than silenced ad hoc.
      '@angular-eslint/no-output-on-prefix': 'off',
      '@angular-eslint/no-input-rename': 'off',
      // Signals-first: the library must not reintroduce decorator inputs/outputs.
      '@angular-eslint/prefer-signals': 'error',
      // OnPush everywhere is a deliberate library-wide invariant, not a per-component choice.
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }]
    }
  },
  {
    // The playground app is a consumer, not part of the published surface: it uses the `app-` prefix.
    files: ['src/**/*.ts'],
    rules: {
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }]
    }
  },
  {
    // Specs legitimately need `any` and host components with the default strategy.
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      '@angular-eslint/component-selector': 'off'
    }
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      /*
       * Listbox options and menu panels are driven by `aria-activedescendant` / roving focus from
       * their owning control, which is the APG pattern: the rows deliberately are not focusable and
       * do not carry their own key handlers. These two rules cannot express that.
       */
      '@angular-eslint/template/interactive-supports-focus': 'off',
      '@angular-eslint/template/click-events-have-key-events': 'off'
    }
  }
);

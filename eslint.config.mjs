import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**', 'client/dist/**', 'coverage/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: [
      'app.js',
      'config/**/*.js',
      'middlewares/**/*.js',
      'pdf/**/*.js',
      'server/**/*.js',
      'tests/**/*.js',
    ],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  {
    files: ['client/**/*.js', 'client/**/*.jsx'],
    languageOptions: {
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },
];

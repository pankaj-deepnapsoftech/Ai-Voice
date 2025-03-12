import { defineConfig } from 'eslint-define-config';
import globals from 'globals';

export default defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.node, // Node.js globals, including process
      },
      parserOptions: {
        ecmaVersion: 2021, // Enable ECMAScript 2021 features (class fields, etc.)
        sourceType: 'module', // Enable ES modules (import/export)
      },
    },
  },
  {
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      indent: ['error', 2],
      semi: ['error', 'always'],
    },
  },
]);

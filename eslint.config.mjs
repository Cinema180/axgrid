import { FlatCompat } from '@eslint/eslintrc';
import tseslint from '@typescript-eslint/eslint-plugin';
import eslintComments from 'eslint-plugin-eslint-comments';
import jest from 'eslint-plugin-jest';
import promise from 'eslint-plugin-promise';
import parser from '@typescript-eslint/parser';

// Create FlatCompat to use "extends" from legacy configs
const compat = new FlatCompat();

export default [
  // Apply general settings
  {
    ignores: ['eslint.config.mjs', '.prettierrc.cjs', 'node_modules/'],
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    languageOptions: {
      parser,
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        node: true,
        browser: true,
        jest: true,
      },
      parserOptions: {
        project: './tsconfig.json', // Ensure this points to your tsconfig.json
        tsconfigRootDir: './', // Adjust if needed
      },
    },

    plugins: {
      '@typescript-eslint': tseslint,
      'eslint-comments': eslintComments,
      jest,
      promise,
    },
  },

  // Extends (Airbnb, Typescript, Prettier) using FlatCompat
  ...compat.extends(
    'airbnb',
    'airbnb-typescript',
    'plugin:cypress/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:import/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
    'plugin:promise/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:typescript-sort-keys/recommended'
  ),
];

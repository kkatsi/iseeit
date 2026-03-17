import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // Prevent features from importing the app layer
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: ['@/app/**'] }],
    },
  },
  // Prevent shared layers from importing features or app
  {
    files: [
      'src/components/**/*.{ts,tsx}',
      'src/hooks/**/*.{ts,tsx}',
      'src/lib/**/*.{ts,tsx}',
      'src/types/**/*.{ts,tsx}',
      'src/utils/**/*.{ts,tsx}',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: ['@/features/**', '@/app/**'] },
      ],
    },
  },
  // Prevent cross-feature imports
  {
    files: ['src/features/game/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@/features/lobby/**',
            '@/features/client-connect/**',
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/lobby/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          // Lobby is host-side and may depend on game/host. Restrict only
          // client-side features it should never touch.
          patterns: [
            '@/features/game/client/**',
            '@/features/client-connect/**',
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/client-connect/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@/features/game/**',
            '@/features/lobby/**',
          ],
        },
      ],
    },
  },
]);

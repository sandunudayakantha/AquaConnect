import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        module: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
    },
  },
];

import eslint from '@eslint/js';

export default [
  // Base configurations
  eslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'semi': ['off'],
      'no-mixed-spaces-and-tabs': 'warn',
      'no-sparse-arrays': 'warn',
      'no-undef': 'off',
    },
  },
  {
    ignores: [
      'dist/',
      'build/',
      'node_modules/',
      '**/*.test.ts',
      '**/*.spec.ts',
      '**/*.config.js'
    ]
  }
]
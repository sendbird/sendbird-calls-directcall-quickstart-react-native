module.exports = {
  env: {
    es2021: true,
  },
  ignorePatterns: ['*.config.js', '.eslintrc.js', 'bootstrap.js'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'linebreak-style': ['error', 'unix'],
    'no-console': 'off',
    'curly': ['warn', 'multi-line'],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'arrow-parens': ['error', 'always'],
    'eol-last': ['warn', 'always'],
    'multiline-ternary': ['off'],
    'no-nested-ternary': 'error',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'comma-dangle': ['warn', 'always-multiline'],
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-var-requires': 'off',
  },
};

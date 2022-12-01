module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'func-names': 0,
    'import/extensions': 0,
    'no-console': 0,
    'no-extend-native': 0,
    'no-plusplus': 0,
    'prefer-destructuring': 0,
  },
}

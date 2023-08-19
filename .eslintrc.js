module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 0,
    'implicit-arrow-linebreak': 0,
    'import/extensions': 0,
    'comma-dangle': 0,
    'no-underscore-dangle': 0,
    'spaced-comment': 0,
    'import/prefer-default-export': 0,
    'no-unused-vars': 0,
    'padded-blocks': 0,
    'prefer-destructuring': 0,
    'object-curly-newline': 0,
  },
};

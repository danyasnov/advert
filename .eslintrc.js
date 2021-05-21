module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:prettier/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'import'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'react/jsx-filename-extension': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-use-before-define': 'off',
    'react/prop-types': 'off',
    'no-underscore-dangle': ['error', {allow: ['_store']}],
    '@typescript-eslint/no-var-requires': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'react/jsx-max-props-per-line': [
      1,
      {
        maximum: 1,
        when: 'multiline',
      },
    ],
  },
  globals: {
    JSX: true,
  },
}

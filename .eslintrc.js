module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
    'jest/globals': true,
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier', 'react-hooks', 'jsdoc', 'jest'],
  rules: {
    'no-underscore-dangle': [0],
    'react/prop-types': [2],
    'react/default-props-match-prop-types': [2],
    'react/forbid-prop-types': [1],
    'react/no-array-index-key': [2],
    'react/no-redundant-should-component-update': [1],
    'react/no-typos': [2],
    'react/no-this-in-sfc': [2],
    'react/no-unused-prop-types': [1],
    'react/no-unused-state': [1],
    'react/react-in-jsx-scope': [2],
    'react/jsx-filename-extension': [0],
    'import/extensions': [0],
    'react/jsx-no-useless-fragment': [1],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/state-in-constructor': [0],
    'react/jsx-wrap-multilines': [0],
    'import/no-extraneous-dependencies': [0],
    'no-console': [1, { allow: ['info', 'warn', 'error'] }],
    'import/no-useless-path-segments': [0],
    'react/jsx-no-bind': [1],
    'react/jsx-closing-bracket-location': [0],
    'react/jsx-one-expression-per-line': [0],
    'no-nested-ternary': [0],
    'import/no-named-as-default-member': [0],
    'import/no-named-as-default': [0],
    'import/prefer-default-export': [0],
  },
};

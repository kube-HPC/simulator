module.exports = {
  jsxBracketSameLine: true,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'avoid',
  overrides: [
    {
      files: '*.js',
      options: {
        parser: 'babel',
      },
    },
  ],
};

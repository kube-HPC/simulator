/* config-overrides.js */
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = function override(config) {
  // do stuff with the webpack config...
  if (!config.plugins) {
    // eslint-disable-next-line
    config.plugins = [];
  }

  config.plugins.push(new MonacoWebpackPlugin({}));

  // eslint-disable-next-line no-param-reassign
  config.ignoreWarnings = [
    {
      module: /mutationobserver-shim/,
    },
  ];

  return config;
};

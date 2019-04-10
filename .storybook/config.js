import { configure } from '@storybook/react';
import 'antd/dist/antd.css';

String.prototype.toUpperCaseFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

function loadStories() {
  const req = require.context('stories', true, /\.stories\.js$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);

import { configure, addParameters } from '@storybook/react';
import 'antd/dist/antd.css';

function loadStories() {
  const req = require.context('stories', true, /\.stories\.js$/);
  req.keys().forEach(filename => req(filename));
}

addParameters({
  options: {
    panelPosition: 'right',
    storySort: (a, b) => a[1].id.localeCompare(b[1].id)
  }
});

configure(loadStories, module);

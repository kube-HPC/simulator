import { configure } from '@storybook/react';
import 'antd/dist/antd.css';

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);

import { addDecorator, addParameters, configure } from '@storybook/react';
import { create } from '@storybook/theming';
import 'antd/dist/antd.css';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../src/store';
import { GlobalStyle } from '../src/styles';

const theme = create({
  base: 'light',
  brandTitle: 'HKube - Storybook',
  brandUrl: 'http://hkube.io/',
});

addDecorator(S => (
  <Provider store={store}>
    <GlobalStyle />
    <S />
  </Provider>
));

addParameters({
  options: {
    showPanel: false,
    storySort: (a, b) => a[1].id.localeCompare(b[1].id),
    theme,
  },
});

configure(require.context('../src', true, /\.stories\.js$/), module);

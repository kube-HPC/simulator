import { configure, addParameters, addDecorator } from '@storybook/react';
import 'antd/dist/antd.css';

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from 'reducers/root.reducer';

const store = createStore(rootReducer);

addDecorator(S => (
  <Provider store={store}>
    <S />
  </Provider>
));

addParameters({
  options: {
    panelPosition: 'right',
    storySort: (a, b) => a[1].id.localeCompare(b[1].id)
  }
});

configure(require.context('../src', true, /\.stories\.js$/), module);

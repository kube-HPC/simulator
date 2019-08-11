import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import HKubeLayout from 'components/Layout/HKubeLayout.react';

render(
  <Provider store={store}>
    <HKubeLayout />
  </Provider>,
  document.getElementById('root')
);

HKubeLayout.whyDidYouRender = true;

// webpack Hot Module Replacement API
if (module.hot) {
  // keep in mind - here you are configuring HMR to accept CHILDREN MODULE
  // while `hot` would configure HMR for the CURRENT module
  module.hot.accept();
}

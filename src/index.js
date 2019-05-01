import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { store } from 'store/index';
import Layout from 'components/smart/LayoutInner.react';

render(
  <Provider store={store}>
    <Layout />
  </Provider>,
  document.getElementById('root')
);

// webpack Hot Module Replacement API
if (module.hot) {
  // keep in mind - here you are configuring HMR to accept CHILDREN MODULE
  // while `hot` would configure HMR for the CURRENT module
  module.hot.accept();
}

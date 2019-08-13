import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import { ErrorBoundary } from 'components';
import DashboardReact from './components/Dashboard/Dashboard.react';

render(
  <Provider store={store}>
    <ErrorBoundary>
      <DashboardReact />
    </ErrorBoundary>
  </Provider>,
  document.getElementById('root')
);

// webpack Hot Module Replacement API
if (module.hot) {
  // keep in mind - here you are configuring HMR to accept CHILDREN MODULE
  // while `hot` would configure HMR for the CURRENT module
  module.hot.accept();
}

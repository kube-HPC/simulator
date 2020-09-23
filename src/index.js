import { ErrorBoundary } from 'components';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReusableProvider } from 'reusable';
import Root from './Routes';
import store from './store';

render(
  <Provider store={store}>
    <ReusableProvider>
      <ErrorBoundary>
        <Router>
          <Root />
        </Router>
      </ErrorBoundary>
    </ReusableProvider>
  </Provider>,
  document.getElementById('root')
);

// webpack Hot Module Replacement API
if (module.hot) {
  // keep in mind - here you are configuring HMR to accept CHILDREN MODULE
  // while `hot` would configure HMR for the CURRENT module
  module.hot.accept();
}

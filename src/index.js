import { ErrorBoundary } from 'components';
import React from 'react';
import { render } from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReusableProvider } from 'reusable';
import { GlobalStyle } from 'styles';
import Root from './Routes';
import store from './store';
import { STATE_SOURCES } from './const';

const RouterWrapper = () => {
  // the base url sets the basename because the app is not always served from the host's root
  const baseUrl = useSelector(state => state[STATE_SOURCES.SETTINGS].baseUrl);
  return (
    <Router basename={baseUrl}>
      <Root />
    </Router>
  );
};

render(
  <Provider store={store}>
    <ReusableProvider>
      <ErrorBoundary>
        <GlobalStyle />
        <RouterWrapper />
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

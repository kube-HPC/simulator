import { ErrorBoundary } from 'components';
import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReusableProvider } from 'reusable';
import { GlobalStyle } from 'styles';
import { useActions } from 'hooks';
import Root from './Routes';
import store from './store';
import { STATE_SOURCES } from './const';

const RouterWrapper = () => {
  const { init } = useActions();
  useEffect(() => {
    init();
  }, [init]);

  const { baseUrl, hasConfig } = useSelector(
    state => state[STATE_SOURCES.CONFIG]
  );

  /**
   * The base url sets the basename because the app is not always served from
   * the host's root.
   *
   * Changing the basename of the router after initial render does not work it
   * has to be set on initial render only!
   *
   * Return null to avoid inner redirects/data fetching inside the app itself
   * until we are all set
   */
  return hasConfig ? (
    <Router basename={baseUrl}>
      <Root />
    </Router>
  ) : null;
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

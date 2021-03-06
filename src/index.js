import { ErrorBoundary } from 'components';
import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReusableProvider } from 'reusable';
import { GlobalStyle } from 'styles';
import { init } from 'actions/connection.action';
import { selectors } from 'reducers';
import Root from './Routes';
import store from './store';

const ConfigProvider = () => {
  // do not use the useActions hook
  // ReusableProvider is not available yet at this point!
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(init());
  }, [dispatch]);

  const { baseUrl, hasConfig } = useSelector(selectors.config);

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
      <ReusableProvider>
        <ErrorBoundary>
          <GlobalStyle />
          <Root />
        </ErrorBoundary>
      </ReusableProvider>
    </Router>
  ) : null;
};

render(
  <Provider store={store}>
    <ConfigProvider />
  </Provider>,
  document.getElementById('root')
);

// webpack Hot Module Replacement API
if (module.hot) {
  // keep in mind - here you are configuring HMR to accept CHILDREN MODULE
  // while `hot` would configure HMR for the CURRENT module
  module.hot.accept();
}

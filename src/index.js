/* eslint-disable */
import 'core-js/features/array';
import './assets/collapseTransition.css';
import { ErrorBoundary } from 'components';
import { useInitTheme } from 'hooks';
import { ConfigProvider } from 'antd';
import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { ReusableProvider } from 'reusable';
import { initDashboardConfig } from 'actions/connection.action';
import { selectors } from 'reducers';
import GlobalThemes from './styles/themes/GlobalThemes';
import Root from './Routes';
import store from './store';
import KeycloakServices from './keycloak/keycloakServices';
import _ from 'lodash';

const ConfigProviderApp = () => {
  // do not use the useActions hook
  // ReusableProvider is not available yet at this point!

  const dispatch = useDispatch();
  const { themeProvider } = useInitTheme();
  const { hasConfig } = useSelector(selectors.config);
  const { keycloakEnable } = useSelector(selectors.connection);
  const firstKc = useRef(true);
  console.log('keycloakEnable:', keycloakEnable);
  useEffect(() => {
    if (keycloakEnable && !KeycloakServices.isLoggedIn() && firstKc.current) {
      console.log('keycloakEnable initKeycloak:', keycloakEnable);
      firstKc.current = false;
      KeycloakServices.initKeycloak(renderApp, renderErrorPreRenderApp);
    }
  }, [keycloakEnable]);

  let tokenRefreshInterval;

  useEffect(() => {
    // get config (dashboard-config.json)
    dispatch(initDashboardConfig());

    if (tokenRefreshInterval) {
      clearInterval(tokenRefreshInterval);
      tokenRefreshInterval = null;
    }

    if (keycloakEnable) {
      tokenRefreshInterval = KeycloakServices.startTokenRefreshInterval();
    }

    return () => {
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
        tokenRefreshInterval = null;
      }
    };
  }, [keycloakEnable]);

  return hasConfig ? (
    <ConfigProvider theme={themeProvider}>
      <HashRouter>
        <ReusableProvider>
          <ErrorBoundary>
            <GlobalThemes />
            <Root />
          </ErrorBoundary>
        </ReusableProvider>
      </HashRouter>
    </ConfigProvider>
  ) : null;
};

const container = document.getElementById('root');
const root = createRoot(container);

const renderApp = () => {
  root.render(
    <Provider store={store}>
      <ConfigProviderApp />
    </Provider>
  );
};

const renderErrorPreRenderApp = () => {
  root.render(<>error</>);
};

renderApp();

// root.unmount();

// webpack Hot Module Replacement API
if (module.hot) {
  // keep in mind - here you are configuring HMR to accept CHILDREN MODULE
  // while `hot` would configure HMR for the CURRENT module
  module.hot.accept();
}

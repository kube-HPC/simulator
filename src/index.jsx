/* eslint-disable */
import 'core-js/features/array';
import './assets/collapseTransition.css';

import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { ReusableProvider } from 'reusable';

import ErrorBoundary from 'components/ErrorBoundary';
import { useInitTheme } from 'hooks';
import { initDashboardConfig } from 'actions/connection.action';
import { selectors } from 'reducers';

import GlobalThemes from './styles/themes/GlobalThemes';
import Root from './Routes';
import store from './store';
import KeycloakServices from './keycloak/keycloakServices';

/* ----------------------------------------------------------
   MAIN CONFIG-PROVIDER APP
----------------------------------------------------------- */

const ConfigProviderApp = () => {
  const dispatch = useDispatch();

  const { themeProvider } = useInitTheme();
  const { hasConfig } = useSelector(selectors.config);
  const { keycloakEnable } = useSelector(selectors.connection);

  const firstKc = useRef(true);

  const tokenRefreshIntervalRef = useRef(null);

  /* -------------------------------
     keycloak initialization
  -------------------------------- */
  useEffect(() => {
    if (keycloakEnable && firstKc.current && !KeycloakServices.isLoggedIn()) {
      firstKc.current = false;

      KeycloakServices.initKeycloak(renderApp, renderErrorPreRenderApp);
    }
  }, [keycloakEnable]);

  /* -------------------------------
     2) Loading config and Token Refresh
  -------------------------------- */
  useEffect(() => {
    dispatch(initDashboardConfig());

    // Cancel previous interval
    if (tokenRefreshIntervalRef.current) {
      clearInterval(tokenRefreshIntervalRef.current);
      tokenRefreshIntervalRef.current = null;
    }

    if (keycloakEnable) {
      tokenRefreshIntervalRef.current =
        KeycloakServices.startPreciseTokenRefresh();
    }

    // cleanup
    return () => {
      if (tokenRefreshIntervalRef.current) {
        clearInterval(tokenRefreshIntervalRef.current);
        tokenRefreshIntervalRef.current = null;
      }
    };
  }, [keycloakEnable, dispatch]);

  if (!hasConfig) return null;

  return (
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
  );
};

/* ----------------------------------------------------------
   ROOT RENDER FUNCTIONS
----------------------------------------------------------- */

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
  root.render(
    <div style={{ padding: 30, color: 'red' }}>
      Error initializing authentication
    </div>
  );
};

renderApp();

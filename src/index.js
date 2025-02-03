/* eslint-disable */
import 'core-js/features/array';
import './assets/collapseTransition.css';
import { ErrorBoundary } from 'components';
import { LOCAL_STORAGE_KEYS } from 'const';
import { ConfigProvider, theme } from 'antd';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { ReusableProvider } from 'reusable';
import { init } from 'actions/connection.action';
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
  useEffect(() => {
    dispatch(init());

    // Start a periodic token refresh
    const tokenRefreshInterval = setInterval(() => {
      KeycloakServices.updateToken(30, () => {
        console.log('Token refreshed successfully!');
      });
    }, 60000);

    // Cleanup on unmount
    return () => clearInterval(tokenRefreshInterval);
  }, [dispatch]);

  const { hasConfig } = useSelector(selectors.config);
  const { defaultAlgorithm, darkAlgorithm } = theme;

  // create in began styles antd by theme name
  let themeProvider = null;
  switch (
    localStorage
      .getItem(LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_THEME)
      ?.toUpperCase()
  ) {
    case 'LIGHT':
      themeProvider = {
        algorithm: defaultAlgorithm,
        token: {
          padding: 10,
        },
      };
      break;
    case 'DARK':
      themeProvider = {
        algorithm: darkAlgorithm,
        token: {
          colorBgBase: '#182039',
          colorTextBase: '#c5c5c5',
          colorInfo: '#180d31',
          colorPrimary: '#2e6fca',

          wireframe: false,
          colorBgLayout: '#180d31',
          colorPrimaryBg: '#252f58',

          components: {
            Table: {
              padding: 30,
            },
          },
        },
      };
      break;
    default:
      themeProvider = { algorithm: defaultAlgorithm };
  }

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

KeycloakServices.initKeycloak(renderApp, renderErrorPreRenderApp);

// root.unmount();

// webpack Hot Module Replacement API
if (module.hot) {
  // keep in mind - here you are configuring HMR to accept CHILDREN MODULE
  // while `hot` would configure HMR for the CURRENT module
  module.hot.accept();
}

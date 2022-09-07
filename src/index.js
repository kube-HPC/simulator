/* eslint-disable */
import 'core-js/features/array';
import './assets/collapseTransition.css';
import { ErrorBoundary } from 'components';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { ReusableProvider } from 'reusable';
import { init } from 'actions/connection.action';
import { selectors } from 'reducers';
import GlobalThemes from './styles/themes/GlobalThemes';
import Root from './Routes';
import store from './store';
import _ from 'lodash';

const ConfigProvider = () => {
  // do not use the useActions hook
  // ReusableProvider is not available yet at this point!
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(init());
  }, [dispatch]);

  const { hasConfig } = useSelector(selectors.config);
  // const  apolloClient2  = useApolloClient();

  return hasConfig ? (
    <Router>
      <ReusableProvider>
        <ErrorBoundary>
          <GlobalThemes />
          <Root />
        </ErrorBoundary>
      </ReusableProvider>
    </Router>
  ) : null;
};

const App = () => {
  return (
    <Provider store={store}>
      <ConfigProvider />
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

// webpack Hot Module Replacement API
if (module.hot) {
  // keep in mind - here you are configuring HMR to accept CHILDREN MODULE
  // while `hot` would configure HMR for the CURRENT module
  module.hot.accept();
}

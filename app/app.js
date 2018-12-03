
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { store } from 'store/index';
import LayoutInner from './components/Layout.react';
import './stylesheets/app.scss';

if ($_ENVIRONMENT === 'development') {
  /* eslint-disable */
  // const Mimic = require('mimic').default;
  // const mocks = require.context(__dirname + '/../mocks', true, /\.json$/);
  // mocks.keys().forEach((key) => Mimic.import(JSON.stringify(mocks(key))));
  /* eslint-enable */
}
render((
  <Provider store={ store }>
    <LayoutInner/>
  </Provider>
), document.getElementById('root'));

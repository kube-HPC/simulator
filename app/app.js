// import 'react-virtualized/styles.css';
// import 'react-select/dist/react-select.css';
// import 'react-day-picker/lib/style.css';
// import 'assets/stylesheets/app.scss';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { store } from 'store/index';
import LayoutInner from 'components/Layout.react';
import './stylesheets/app.scss';
// import { ThemeProvider } from 'styled-components';
// import theme from 'constants/theme';
// import messages from 'constants/locales/en-US';
if ($_ENVIRONMENT === 'development') {
  /* eslint-disable */
  // const Mimic = require('mimic').default;
  // const mocks = require.context(__dirname + '/../mocks', true, /\.json$/);
  // mocks.keys().forEach((key) => Mimic.import(JSON.stringify(mocks(key))));
  /* eslint-enable */
}
render((
  // <IntlProvider locale="en-US" messages={ messages }>
    <Provider store={ store }>
        <LayoutInner />
    </ Provider>
  // </IntlProvider>
), document.getElementById('root'));

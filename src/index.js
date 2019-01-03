import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {store} from './store/index';
import LayoutInner from './components/containers/Layout.react';

render((
  <Provider store={ store }>
    <LayoutInner/>
  </Provider>
), document.getElementById('root'));

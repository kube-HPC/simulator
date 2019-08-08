import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import rootReducer from 'reducers/root.reducer';
import socketMiddleware from 'middleware/socket.middleware';
import restConfigMiddleware from 'middleware/restConfig.middleware';
import restMiddleware from 'middleware/rest.middleware';
import messagesMiddleware from 'middleware/messages.middleware';
import React from 'react';
import whyDidYouRender from '@welldone-software/why-did-you-render';
import { COLOR } from 'styles/colors';

const middleware = [
  messagesMiddleware,
  socketMiddleware,
  restConfigMiddleware,
  restMiddleware
];

if (process.env.NODE_ENV === 'development') {
  middleware.unshift(createLogger({ collapsed: true }));
  // whyDidYouRender(React, {
  //   onlyLogs: true,
  //   titleColor: COLOR.blueLight,
  //   diffNameColor: COLOR.lightOrange,
  //   diffPathColor: COLOR.lightGreen
  // });
}

const composeEnhancers =
  process.env.NODE_ENV === 'development' &&
  typeof window === 'object' &&
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose);

const enhancer = composeEnhancers(applyMiddleware(...middleware));

const store = createStore(rootReducer, enhancer);
export default store;
